import config from '../config.js';

// Transform a Google Form response into a structured database record
export function transformFormResponse(formResponse) {
  const dbRecord = {
    responseID: formResponse.responseId,
    submittedAt: new Date(formResponse.createTime),
    rawResponses: formResponse.answers // Keep raw data as backup
  };

  // Transform each answer using the field mappings
  for (const [questionId, answerData] of Object.entries(formResponse.answers || {})) {
    const mapping = config.form.database_mappings[questionId];
    
    if (!mapping) {
      console.warn(`No mapping found for question ID: ${questionId}`);
      continue;
    }

    const value = extractAnswerValue(answerData);
    const transformedValue = transformValue(value, mapping);
    
    dbRecord[mapping.field] = transformedValue;
  }

  return dbRecord;
}

//Extract the actual answer value from Google Form response structure
function extractAnswerValue(answerData) {
  if (answerData.textAnswers?.answers?.[0]?.value) {
    return answerData.textAnswers.answers[0].value;
  }
  if (answerData.fileUploadAnswers?.answers?.[0]) {
    return answerData.fileUploadAnswers.answers[0];
  }
  return null;
}

//Transform a value based on its mapping configuration
function transformValue(value, mapping) {
  if (value === null || value === undefined) {
    return mapping.required ? null : undefined;
  }

  switch (mapping.type) {
    case 'boolean':
      if (mapping.transform) {
        return mapping.transform[value] ?? null;
      }
      return Boolean(value);
    
    case 'decimal':
      const numValue = parseFloat(value);
      return isNaN(numValue) ? null : numValue;
    
    case 'string':
      return String(value).trim();
    
    case 'file':
      // Extract Google Drive file ID and create accessible URL via our API
      return generateFileUrl(value, mapping.file_type);
    
    default:
      return value;
  }
}

// Generate accessible file URL via our API endpoints
function generateFileUrl(fileData, fileType) {
  if (!fileData || !fileData.fileId) {
    return null;
  }
  
  const fileId = fileData.fileId;
  const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  
  // Route to appropriate endpoint based on file type
  if (fileType === 'image') {
    return `${baseUrl}/api/files/${fileId}/image`;
  } else if (fileType === 'pdf') {
    return `${baseUrl}/api/files/${fileId}/pdf`;
  }
  
  // Default to PDF viewer for other file types
  return `${baseUrl}/api/files/${fileId}/pdf`;
}

//Validate a transformed record against the field mappings
export function validateRecord(record) {
  const errors = [];
  
  for (const [questionId, mapping] of Object.entries(config.form.database_mappings)) {
    const value = record[mapping.field];
    
    // Check required fields
    if (mapping.required && (value === null || value === undefined || value === '')) {
      errors.push(`${mapping.field} is required`);
      continue;
    }
    
    // Skip validation if field is optional and empty
    if (!value) continue;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

//Get all file upload question IDs
export function getFileUploadQuestions() {
  const mappings = getDatabaseMappings();
  return Object.entries(mappings)
    .filter(([_, mapping]) => mapping.type === 'file')
    .map(([questionId, mapping]) => ({ questionId, ...mapping }));
} 
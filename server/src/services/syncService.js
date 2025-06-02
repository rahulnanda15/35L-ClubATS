import { PrismaClient } from '@prisma/client'
import { getResponses } from './formsService.js'
import { transformFormResponse, validateRecord } from '../dataMapper.js'

const prisma = new PrismaClient()

export async function syncFormResponses(formsClient) {
  try {
    const responses = await getResponses(formsClient)
    
    // Get existing response IDs
    const existingResponseIds = new Set(
      (await prisma.application.findMany({
        select: { responseID: true }
      })).map(r => r.responseID)
    )
    
    // Filter out responses that are already in the database
    const newResponses = responses.filter(response => !existingResponseIds.has(response.responseId))
    
    for (const response of newResponses) {
      try {
        // Transform the form response to structured data
        const dbRecord = transformFormResponse(response);
        
        // Validate the transformed data
        const validation = validateRecord(dbRecord);
        if (!validation.isValid) {
          console.error(`Validation failed for response ${response.responseId}:`, validation.errors);
          errorCount++;
          continue;
        }
        
        // Create the application record
        await prisma.application.create({
          data: dbRecord
        });
        
      } catch (error) {
        console.error(`Error processing response ${response.responseId}:`, error.message);
      }
    }
    
    if (newResponses.length > 0) {
      console.log(`Ssynced ${newResponses.length} new responses`);
    }
    
  } catch (error) {
    console.error('Error syncing form responses:', error)
  }
} 
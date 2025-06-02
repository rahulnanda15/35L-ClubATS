import fs from 'node:fs';
import path from 'node:path';

const formConfigPath = path.resolve(process.env.FORM_CONFIG_PATH);

export function loadFormConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(formConfigPath, 'utf8'));
    return config;
  } catch (error) {
    throw new Error(`Failed to load form configuration: ${error.message}`);
  }
}


export function getDatabaseMappings() {
  const config = loadFormConfig();
  return config.database_mappings;
}


export function getFormId() {
  const config = loadFormConfig();
  return config.form_id;
}


import fs from 'node:fs';
import path from 'node:path';

import dotenv from 'dotenv';

dotenv.config();

const formConfigPath = path.resolve(process.env.FORM_CONFIG_PATH);
const formConfig = JSON.parse(fs.readFileSync(formConfigPath, 'utf8'));

const config = {
  port: process.env.PORT || 3001,
  
  dbUrl: process.env.DATABASE_URL,
  gCloudKeyPath: path.resolve(process.env.GOOGLE_CLOUD_KEY_PATH),

  form: formConfig,
};

export default config;
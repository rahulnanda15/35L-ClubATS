// server/src/google/formsClient.js
import path from 'node:path';
import fs from 'node:fs';
import formsClient from '@googleapis/forms';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const keyPath = path.resolve(process.env.GOOGLE_CLOUD_KEY_PATH);
const formConfigPath = path.resolve(process.env.FORM_CONFIG_PATH);
const formConfig = JSON.parse(fs.readFileSync(formConfigPath, 'utf8'));

const SCOPES = [
  'https://www.googleapis.com/auth/forms.responses.readonly',
];

const auth = new GoogleAuth({
    keyFile: keyPath,
    scopes: SCOPES,
});

export async function getFormsClient() {
  
  const authClient = await auth.getClient();
  const formsClientInstance = formsClient.forms({ version: 'v1', auth: authClient });
  
  return formsClientInstance;
}


export async function getResponses(client) {
  const forms = await getFormsClient();
  const res = await forms.forms.responses.list({ formId: formConfig.id });
  return res.data.responses ?? [];
}

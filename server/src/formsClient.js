// server/src/google/formsClient.js
import path from 'node:path';
import formsClient from '@googleapis/forms';
import { GoogleAuth } from 'google-auth-library';

import dotenv from 'dotenv';
dotenv.config();

const keyPath = path.resolve(process.env.GOOGLE_CLOUD_KEY_PATH);

const SCOPES = [
  'https://www.googleapis.com/auth/forms.responses.readonly',
];

const auth = new GoogleAuth({
    keyFile: keyPath,
    scopes: SCOPES,
});

// 1) Build an authorised client once and reuse it
async function buildFormsClient() {
  const authClient = await auth.getClient();
  return formsClient.forms({ version: 'v1', auth: authClient });
}

// 2) Example: fetch every response for one form
export async function listResponses() {
  const forms = await buildFormsClient();
  const res = await forms.forms.responses.list({ formId: process.env.FORM_ID });
  return res.data.responses ?? [];
}

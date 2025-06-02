import { google } from 'googleapis';
import { getGoogleAuthClient } from './auth.js';

let formsClient;

async function getFormsClient() {
  if (!formsClient) {
    const authClient = await getGoogleAuthClient();
    formsClient = google.forms({ version: 'v1', auth: authClient });
  }
  return formsClient;
}

export async function getResponses(formId) {
  const client = await getFormsClient();
  const res = await client.forms.responses.list({ formId });
  return res.data.responses ?? [];
}

// for testing
export async function getFormQuestions(formId) {
  const client = await getFormsClient();
  const res = await client.forms.get({ formId });
  return res.data.items ?? [];
} 
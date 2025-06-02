import formsClient from '@googleapis/forms';
import { getGoogleAuthClient } from './googleAuth.js';
import { getFormId } from '../configManager.js';

let formsClientInstance;

export async function getFormsClient() {
  if (!formsClientInstance) {
    const authClient = await getGoogleAuthClient();
    formsClientInstance = formsClient.forms({ version: 'v1', auth: authClient });
  }
  return formsClientInstance;
}

export async function getResponses(client) {
  const formId = getFormId();
  const res = await client.forms.responses.list({ formId });
  return res.data.responses ?? [];
}

export async function getFormQuestions(client) {
  const formId = getFormId();
  const res = await client.forms.get({ formId });
  return res.data.items ?? [];
} 
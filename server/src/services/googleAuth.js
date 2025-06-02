import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const keyPath = path.resolve(process.env.GOOGLE_CLOUD_KEY_PATH);

// Combined scopes for both Forms and Drive
const SCOPES = [
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];

const auth = new GoogleAuth({
  keyFile: keyPath,
  scopes: SCOPES,
});

let authClient;

// Get shared authenticated client for Google APIs
export async function getGoogleAuthClient() {
  if (!authClient) {
    authClient = await auth.getClient();
  }
  return authClient;
} 
import { GoogleAuth } from 'google-auth-library';
import config from '../../config.js';


const SCOPES = [
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];

const auth = new GoogleAuth({
  keyFile: config.gCloudKeyPath,
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
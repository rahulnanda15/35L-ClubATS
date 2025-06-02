import { google } from 'googleapis';
import { getGoogleAuthClient } from './auth.js';

let driveClient;

async function getDriveClient() {
  if (!driveClient) {
    const authClient = await getGoogleAuthClient();
    driveClient = google.drive({ version: 'v3', auth: authClient });
  }
  return driveClient;
}

//Get direct download stream for a Google Drive file
export async function getFileStream(fileId) {
  try {
    const drive = await getDriveClient();
    const res = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'stream' });
    
    return res.data;
  } catch (error) {
    console.error(`Error getting file stream for ${fileId}:`, error.message);
    throw error;
  }
}

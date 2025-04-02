import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Create a properly typed credential object
const serviceAccountCredentials: admin.ServiceAccount = {
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.CLIENT_EMAIL,
};

// Initialize Firebase Admin
const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountCredentials),
});

export default firebaseAdmin;
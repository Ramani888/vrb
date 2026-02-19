import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Check if Firebase credentials are available
const hasFirebaseCredentials = 
  process.env.PROJECT_ID && 
  process.env.PRIVATE_KEY && 
  process.env.CLIENT_EMAIL;

let firebaseAdmin: admin.app.App | null = null;

if (hasFirebaseCredentials) {
  try {
    // Create a properly typed credential object
    const serviceAccountCredentials: admin.ServiceAccount = {
      projectId: process.env.PROJECT_ID as string,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
      clientEmail: process.env.CLIENT_EMAIL as string,
    };

    // Initialize Firebase Admin
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountCredentials),
    });

    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
} else {
  console.warn('Firebase Admin credentials not found. Firebase features will be disabled.');
  console.warn('Please add PROJECT_ID, PRIVATE_KEY, and CLIENT_EMAIL to your .env file');
}

export default firebaseAdmin;
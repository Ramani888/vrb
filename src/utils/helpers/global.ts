import { S3Client, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const s3 = new S3Client({ region: process.env.AWS_REGION });

export const generatePassword = () => {
    const length = 8;
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*';
    const allChars = lowercase + uppercase + numbers + specialChars;
  
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
    // Fill the rest of the password length
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
  
    // Shuffle the characters to avoid predictable patterns
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}

export const deleteImageS3 = async (imagePath: string) => {
  try {
      // Extract file key
      const fileKey = imagePath.split(".amazonaws.com/")[1];

      // Check if the file exists
      const headCommand = new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: fileKey,
      });

      try {
          await s3.send(headCommand); // If this succeeds, the file exists

          // Proceed with deletion
          const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: fileKey,
          });

          await s3.send(deleteCommand);
          console.log(`File deleted: ${fileKey}`);
      } catch (error: any) {
          if (error.name === "NotFound") {
              console.log("File does not exist in S3.");
          } else {
              console.error("Error checking file existence:", error);
          }
      }
  } catch (err) {
      console.error("Error:", err);
  }
}
import { S3Client, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { IUsers } from "../../types/user";
import { IProduct } from "../../types/product";
import path from "path";
import fs from 'fs';
import { promises as fsPromises } from 'fs';
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

export const isEqualIgnoreCase = (str1: string, str2: string) => {
    return str1.toLowerCase() === str2.toLowerCase();
}

export const checkUserLocationAndGetDeliveryCharge = (userData: IUsers, productData: IProduct) => {
    if (userData?.state && userData?.city) {
        if (isEqualIgnoreCase(userData?.state, 'Gujarat') && isEqualIgnoreCase(userData?.city, 'surat')){
            return productData?.inSuratCityCharge
        } else if (isEqualIgnoreCase(userData?.state, 'Gujarat') && !isEqualIgnoreCase(userData?.city, 'surat')) {
            return productData?.inGujratStateCharge
        } else if (!isEqualIgnoreCase(userData?.state, 'Gujarat')) {
            return productData?.inOutStateCharge
        }
    }
}

export const checkUserGujratState = (userData: IUsers, productData: IProduct) => {
    if (userData?.state && userData?.city) {
        if (isEqualIgnoreCase(userData?.state, 'Gujarat') && isEqualIgnoreCase(userData?.city, 'surat')){
            return true
        } else if (isEqualIgnoreCase(userData?.state, 'Gujarat') && !isEqualIgnoreCase(userData?.city, 'surat')) {
            return true
        } else if (!isEqualIgnoreCase(userData?.state, 'Gujarat')) {
            return false
        }
    }
}

export const RAZOR_PAY_KEY_ID = 'rzp_live_g5FHxyE0FQivlu';
export const RAZOR_PAY_KEY_SECRET = 'C14bmIZD7SMjU4cZ0GjrID7g';

export const deleteVpsUpload = async (fileUrl: string): Promise<boolean> => {
  try {
    if (!fileUrl) return false;

    const allowedBase = "https://vrfashionjewelleary.in/uploads/";
    if (!fileUrl.startsWith(allowedBase)) return false;

    let folder: "images" | "videos";
    if (fileUrl.includes("/uploads/images/")) folder = "images";
    else if (fileUrl.includes("/uploads/videos/")) folder = "videos";
    else return false;

    const fileName = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), "uploads", folder, fileName);

    await fsPromises.unlink(filePath);
    return true;

  } catch (error: any) {
    if (error.code === "ENOENT") return false; // file not found
    console.error("Delete error:", error);
    return false;
  }
};
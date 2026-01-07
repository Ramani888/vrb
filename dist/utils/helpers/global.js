"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVpsUpload = exports.RAZOR_PAY_KEY_SECRET = exports.RAZOR_PAY_KEY_ID = exports.checkUserGujratState = exports.checkUserLocationAndGetDeliveryCharge = exports.isEqualIgnoreCase = exports.deleteImageS3 = exports.generatePassword = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({ region: process.env.AWS_REGION });
const generatePassword = () => {
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
};
exports.generatePassword = generatePassword;
const deleteImageS3 = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract file key
        const fileKey = imagePath.split(".amazonaws.com/")[1];
        // Check if the file exists
        const headCommand = new client_s3_1.HeadObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        });
        try {
            yield s3.send(headCommand); // If this succeeds, the file exists
            // Proceed with deletion
            const deleteCommand = new client_s3_1.DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
            });
            yield s3.send(deleteCommand);
            console.log(`File deleted: ${fileKey}`);
        }
        catch (error) {
            if (error.name === "NotFound") {
                console.log("File does not exist in S3.");
            }
            else {
                console.error("Error checking file existence:", error);
            }
        }
    }
    catch (err) {
        console.error("Error:", err);
    }
});
exports.deleteImageS3 = deleteImageS3;
const isEqualIgnoreCase = (str1, str2) => {
    return str1.toLowerCase() === str2.toLowerCase();
};
exports.isEqualIgnoreCase = isEqualIgnoreCase;
const checkUserLocationAndGetDeliveryCharge = (userData, productData) => {
    if ((userData === null || userData === void 0 ? void 0 : userData.state) && (userData === null || userData === void 0 ? void 0 : userData.city)) {
        if ((0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.state, 'Gujarat') && (0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.city, 'surat')) {
            return productData === null || productData === void 0 ? void 0 : productData.inSuratCityCharge;
        }
        else if ((0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.state, 'Gujarat') && !(0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.city, 'surat')) {
            return productData === null || productData === void 0 ? void 0 : productData.inGujratStateCharge;
        }
        else if (!(0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.state, 'Gujarat')) {
            return productData === null || productData === void 0 ? void 0 : productData.inOutStateCharge;
        }
    }
};
exports.checkUserLocationAndGetDeliveryCharge = checkUserLocationAndGetDeliveryCharge;
const checkUserGujratState = (userData, productData) => {
    if ((userData === null || userData === void 0 ? void 0 : userData.state) && (userData === null || userData === void 0 ? void 0 : userData.city)) {
        if ((0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.state, 'Gujarat') && (0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.city, 'surat')) {
            return true;
        }
        else if ((0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.state, 'Gujarat') && !(0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.city, 'surat')) {
            return true;
        }
        else if (!(0, exports.isEqualIgnoreCase)(userData === null || userData === void 0 ? void 0 : userData.state, 'Gujarat')) {
            return false;
        }
    }
};
exports.checkUserGujratState = checkUserGujratState;
exports.RAZOR_PAY_KEY_ID = 'rzp_live_g5FHxyE0FQivlu';
exports.RAZOR_PAY_KEY_SECRET = 'C14bmIZD7SMjU4cZ0GjrID7g';
const deleteVpsUpload = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!fileUrl)
            return false;
        const allowedBase = "https://vrfashionjewelleary.in/uploads/";
        if (!fileUrl.startsWith(allowedBase))
            return false;
        let folder;
        if (fileUrl.includes("/uploads/images/"))
            folder = "images";
        else if (fileUrl.includes("/uploads/videos/"))
            folder = "videos";
        else
            return false;
        const fileName = path_1.default.basename(fileUrl);
        const filePath = path_1.default.join(process.cwd(), "uploads", folder, fileName);
        yield fs_1.promises.unlink(filePath);
        return true;
    }
    catch (error) {
        if (error.code === "ENOENT")
            return false; // file not found
        console.error("Delete error:", error);
        return false;
    }
});
exports.deleteVpsUpload = deleteVpsUpload;

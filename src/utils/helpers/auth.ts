import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const env = process.env;

export const encryptPassword = (password: string) => {
    return new Promise((resolve) => {
      bcrypt.genSalt(5, function (err, salt: any) {
      bcrypt.hash(password, salt, function (err, hash) {
          return resolve(hash);
      });
      });
    });
};
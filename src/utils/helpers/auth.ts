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

export const comparePassword = (storedPassword: string, validatePassword: string): Promise<boolean> => {
  if (storedPassword === validatePassword) {
      return Promise.resolve(true);
  }
  return new Promise((resolve, reject) => {
    bcrypt.compare(storedPassword, validatePassword, (err: Error | null, res?: boolean) => {
      if (err) return reject(err);
      return res === true ? resolve(res) : reject(new Error('Passwords do not match.'));
    });
  });
};
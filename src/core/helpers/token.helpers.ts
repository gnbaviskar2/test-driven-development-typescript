import crypto from 'crypto';

// eslint-disable-next-line import/prefer-default-export
export const generateActivationToken = (length: number) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
};

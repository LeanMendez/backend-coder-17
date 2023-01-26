import bcrypt from 'bcrypt'

export const createHash = (pass) => {
  const hash = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
  return hash;
};

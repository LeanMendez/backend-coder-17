import bcrypt from 'bcrypt'

export const isValidPassword = (user, pass) => {
  return bcrypt.compareSync(pass, user.password);
};

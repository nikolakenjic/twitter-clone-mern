import bcrypt from 'bcryptjs';

export const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPw = await bcrypt.hash(password, salt);

  return hashPw;
};

export const comparePasswords = async (password, hashPw) => {
  const isMatch = await bcrypt.compare(password, hashPw);

  return isMatch;
};

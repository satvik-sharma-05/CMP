import bcrypt from 'bcryptjs';

const hashPassword = async () => {
  const hash = await bcrypt.hash('admin123', 10);
  console.log(hash);
};

hashPassword();

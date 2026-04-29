import bcrypt from "bcryptjs";

const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (err) {
    throw new Error("Error while verifying password: " + err.message);
  }
};

export default verifyPassword;

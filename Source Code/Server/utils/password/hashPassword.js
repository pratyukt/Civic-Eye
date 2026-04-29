import bcrypt from "bcryptjs";

const hashPassword = async(password)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        return hashed;
      } catch (err) {
        throw new Error("Error while hashing password: " + err.message);
      }
}

export default hashPassword;
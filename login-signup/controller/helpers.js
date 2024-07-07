import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


// bcrypt
const saltRounds = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
};

 const comparePassword = (plain, hashed) =>
    bcrypt.compareSync(plain, hashed);

const bcryptHelper = {
    hashPassword,
    comparePassword
};

// jwt token

// dotenv
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export default { bcryptHelper, jwtSecret };

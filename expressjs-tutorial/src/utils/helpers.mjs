import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password, salt); // returns hashed password if no return error undefined
};

// bcrypt.compareSync(password, hashedPassword)

export const comparePassword = (plain, hashed) => 
    bcrypt.compareSync(plain, hashed); // when using {} need to use return otherwise undefined will then be returned as error
export const createUserValidationSchema = {
    username:{
        isLength: { options: {min: 5,max: 30}, errorMessage: "Username must be at least 5 characters with a max of 30 characters"},
        notEmpty: {errorMessage: "Username cannot be empty!"},
        isString: {errorMessage: "Username must be a string!"},
    },
    displayName:{
        notEmpty: true,
    },
    password: {
        notEmpty: true
    }
};
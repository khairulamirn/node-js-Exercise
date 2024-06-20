import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
    const {params: {id}} = req; 
    // This line extracts the id parameter from the request's URL parameters (req.params). For example, if the URL is /api/users/3, id will be 3.
    const parsedId = parseInt(id); // to make sure its numarical value Int = integer 
    // parseInt = Convert a string into an integer
    if (isNaN(parsedId)) return res.sendStatus(400); // error if Id is not a number
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);  // search index user from mockUsers array by id matching parsedId
    if (findUserIndex === -1) return res.sendStatus(404); // error if cant find user
    req.findUserIndex = findUserIndex; 
    // Stores the `findUserIndex` in the request object (`req.findUserIndex`) so it can be accessed by the next middleware or route handler.
    next(); // eror or null argument (to pass control to the next middleware function or route handler.)
};
import { Router } from "express"; //express router
import { 
    query, 
    validationResult, 
    checkSchema, 
    matchedData 
} from "express-validator";
// express validator to validate incoming data for our Express API (process that data, save it to a database, submit it to another external API) using as middleware (validation that require req body) (query, body, headers, cookies, route parameters)
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();

// route to users and using query parameters
router.get(
'/api/users',
query('filter')
    .isString()
    .notEmpty().withMessage('Must not be empty')
    .isLength({min: 3, max: 10}).withMessage('Must be at least 3-10 characters'), // validation 
(req,res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);
    } // session data stored in data structure on the server in memory.
);
    // console.log(req['express-validator#contexts']);
    const result = validationResult(req);
    console.log(result);
    const 
        {query: {filter, value}, // Destructuring the Query Parameters
        // shorthand for: 
        // const filter = req.query.filter;
        // const value = req.query.value;
    } = req;
    // if(!filter && !value) return res.send(mockUsers); // when filter and value are undefined or...
    if (filter && value) 
        return res.send( // if defined then
            mockUsers.filter((user) => user[filter].includes(value)) // check mockUsers
        );
    return res.send(mockUsers); // else if there is only filter or value or nothing it will send mockUsers 
   }
); // example http://localhost:3000/api/users?filter=username&value=h (make sure to run the server)
// QUERY PARAMETERS = They are commonly used in web development to filter, sort, or provide additional details for a request. Query parameters are added to the URL after a question mark (?) and are separated by ampersands (&). Each parameter consists of a key and a value, separated by an equals sign (=).

// GET REQUEST by id
router.get('/api/users/:id', resolveIndexByUserId, (req,res) => {
    console.log(req.params); // allows you to capture dynamic values from the URL path
    const {findUserIndex} = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404); // error for not found id such as 30 
    return res.send(findUser); // else findUser
});

// POST REQUEST (create data) // #5
/*router.post(
'/api/users',
checkSchema(createUserValidationSchema), //using schema
(req,res) => {
    console.log(req.body); // example {"username": "dev"}
    const result = validationResult(req);
    console.log(result);
    // errors
    if (!result.isEmpty()) // boolean true ! false using logical operator
        return res.status(400).send({errors: result.array()}); 
    // push data
    const data = matchedData(req); // match the require from validation
    // The data property contains the data sent by the client in the POST request. After this line, data will hold the same object that was logged in the previous line.
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data}; // -1 is for last one 
    // This line creates a new user object. It does this by combining an id property with the properties from the data object.
    mockUsers.push(newUser); 
    return res.status(201).send(newUser);
   }
);
*/

router.post( // #16
    "/api/users", 
    checkSchema(createUserValidationSchema), // dont throw error
    async (req, res) => { 
    const result = validationResult(req); // this throws an error by request handler
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req); // all validation data in object
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    } 
});

// PUT REQUEST = update entire resource for that specific id 
router.put('/api/users/:id', resolveIndexByUserId, (req,res) => { //This route uses the `resolveIndexByUserId` middleware before executing the route handler.
    const {body, findUserIndex} = req; 
    //Extracts `body` and `findUserIndex` from the request object. `body` contains the data sent with the PUT request, and `findUserIndex` was set by the resolveIndexByUserId middleware.
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}; // Updates the user at `findUserIndex` in the mockUsers array.
    return res.sendStatus(200);
});

// PATCH REQUEST = update partially
router.patch('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const {body,findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}; 
    return res.sendStatus(200);
});

// DELETE REQUEST 
router.delete('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const {findUserIndex} = req;
    mockUsers.splice(findUserIndex, 1); // using splice while argument findUserIndex and delete count 
    return res.sendStatus(200);
});

export default router;
// ECMA SCRIPT MODULE 
import express from 'express'; // import express

// express validator to validate incoming data for our Express API (process that data, save it to a database, submit it to another external API) using as middleware (validation that require req body) (query, body, headers, cookies, route parameters)
import { 
    query, 
    validationResult, 
    matchedData, 
    checkSchema } from "express-validator"; 
import { createUserValidationSchema } from './utils/validationSchemas.mjs';

const app = express(); // assigning to express for use

app.use(express.json()); // application sets up middleware that parses incoming request bodies containing JSON and makes the parsed data available under the `req.body` property.

// register middleware
const loggingMiddleware = (req,res, next) => { // middleware must be registered before routes
    console.log(`Method: ${req.method} - url: ${req.url}`);
    next();
};

app.use(loggingMiddleware, (req,res, next) => {  //use middleware
    console.log("Finished Logging...");
    next();
});

// data object
const mockUsers = [
    {id: 1, username: 'anson', displayName: 'Anson'},
    {id: 2, username: 'amirin', displayName: 'Amirin'},
    {id: 3, username: 'khairul', displayName: 'Khairul'},
    {id: 4, username: 'tina', displayName: 'Tina'},
    {id: 5, username: 'henry', displayName: 'Henry'},
    {id: 6, username: 'marilyn', displayName: 'Marilyn'},
];

const PORT = process.env.PORT || 3000;
// Production Environment: In a production setting, the server (like Heroku, AWS, or any other hosting service) usually provides a port for your application to run on, which will be set in the PORT environment variable. Thus, process.env.PORT will have a value, and the application will listen on that port.

const resolveIndexByUserId = (req, res, next) => {
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

//  example using middleware
app.get('/', 
    (req, res, next) => {
        console.log("Base URL 1");
        next(); // call next middleware
    },
    (req, res, next) => {
        console.log("Base URL 2");
        next(); // call next middleware
    },
    (req, res, next) => {
        console.log("Base URL 3");
        next(); // call next middleware
    },
    (req, res) => {
    res.status(200).send('Hello world');}
);

// route to users and using query parameters
app.get(
    '/api/users', 
    query('filter')
        .isString()
        .notEmpty().withMessage('Must not be empty')
        .isLength({min: 3, max: 10}).withMessage('Must be at least 3-10 characters'), // validation 
    (req,res) => {
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
app.get('/api/users/:id', resolveIndexByUserId, (req,res) => {
    console.log(req.params); // allows you to capture dynamic values from the URL path
    const {findUserIndex} = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404); // error for not found id such as 30 
    return res.send(findUser); // else findUser
});

app.get('/api/products', (req,res) => {
    res.send([ {id: 123, name: 'chicken', price: 12.99}]);
});

// POST REQUEST create data 
app.post(
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
});

// PUT REQUEST = update entire resource for that specific id 
app.put('/api/users/:id', resolveIndexByUserId, (req,res) => { //This route uses the `resolveIndexByUserId` middleware before executing the route handler.
    const {body, findUserIndex} = req; 
    //Extracts `body` and `findUserIndex` from the request object. `body` contains the data sent with the PUT request, and `findUserIndex` was set by the resolveIndexByUserId middleware.
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}; // Updates the user at `findUserIndex` in the mockUsers array.
    return res.sendStatus(200);
});

// PATCH REQUEST = update partially
app.patch('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const {body,findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}; 
    return res.sendStatus(200);
});

// DELETE REQUEST 
app.delete('/api/users/:id', resolveIndexByUserId, (req,res) => {
    const {findUserIndex} = req;
    mockUsers.splice(findUserIndex, 1); // using splice while argument findUserIndex and delete count 
    return res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});

// localhost:3000  //domain
// localhost:3000/products  //route path
// localhost:3000/products?key=value&key2=value2  //query string

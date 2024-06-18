// ECMA SCRIPT MODULE 
import express from 'express';

const app = express(); 

// register middleware
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: 'anson', displayName: 'Anson'},
    {id: 2, username: 'amirin', displayName: 'Amirin'},
    {id: 3, username: 'khairul', displayName: 'Khairul'},
    {id: 4, username: 'tina', displayName: 'Tina'},
    {id: 5, username: 'henry', displayName: 'Henry'},
    {id: 6, username: 'marilyn', displayName: 'Marilyn'},
];

// Production Environment: In a production setting, the server (like Heroku, AWS, or any other hosting service) usually provides a port for your application to run on, which will be set in the PORT environment variable. Thus, process.env.PORT will have a value, and the application will listen on that port.

app.get('/', (req, res) => {
    res.status(200).send('Hello world');
});

app.get('/api/users', (req,res) => {
    console.log(req.query);
    const 
        {query: {filter, value}, // Destructuring the Query Parameters
        // shorthand for: 
        // const filter = req.query.filter;
        // const value = req.query.value;
    } = req;
    // if(!filter && !value) return res.send(mockUsers); // when filter and value are undefined
    if (filter && value) 
        return res.send( // if defined then
            mockUsers.filter((user) => user[filter].includes(value)) // check mockUsers
        );
    return res.send(mockUsers); // if there is only filter or value it will send mockUsers 
});

// POST REQUEST 
app.post('/api/users', (req,res) => {
    console.log(req.body);
    const {body} = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
});

app.get('/api/users/:id', (req,res) => {
    console.log(req.params); // allows you to capture dynamic values from the URL path
    const parsedId = parseInt(req.params.id); 
    console.log(parsedId); // access the value of the “id” parameter
    if (isNaN(parsedId)) return res.status(404).send('Invalid ID.'); // error for invalid ID

    const findUser = mockUsers.find((user) => user.id === parsedId); // find user
    if (!findUser) return res.sendStatus(404); // error for not found id such as 30 
    return res.send(findUser); // else findUser
});

app.get('/api/products', (req,res) => {
    res.send([ {id: 123, name: 'chicken', price: 12.99}]);
});

// PUT REQUEST 
app.put('/api/users/:id', (req,res) => {
    const {
        body, 
        params: {id},
    } = req;

    const parsedId = parseInt(id); // to make sure its numarical value
    if (isNaN(parsedId)) return res.sendStatus(400); // error for not a number
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId); // search user from mockUsers by id
    if (findUserIndex === -1) return res.sendStatus(404); // error if cant find userindex

    mockUsers[findUserIndex] = {id: parsedId, ...body};
    return res.sendStatus(200);

});

// PATCH REQUEST 
app.patch('/api/users/:id', (req,res) => {
    const {
        body, 
        params: {id},
    } = req;

    const parsedId = parseInt(id); 
    if (isNaN(parsedId)) return res.sendStatus(400); 
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId); 
    if (findUserIndex === -1) return res.sendStatus(404);

    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return res.sendStatus(200);
}) 

app.delete('/api/users/:id', (req,res) => {
    const { 
    params: {id},
    } = req;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);
    mockUsers.splice(findUserIndex, 1); //delete count
    return res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});

// localhost:3000 //domain
// localhost:3000/products // route path
// localhost:3000/products?key=value&key2=value2 // query string

// QUERY PARAMETERS = They are commonly used in web development to filter, sort, or provide additional details for a request. Query parameters are added to the URL after a question mark (?) and are separated by ampersands (&). Each parameter consists of a key and a value, separated by an equals sign (=).

// POST REQUEST = create data 
// PUT REQUEST / PATCH = update data different ways (PATCH update partially PUT update entire resource)
// DELETE REQUEST 
import express from 'express';
import router from '../routes/route.js';


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3030;

// routes   
app.use(router);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
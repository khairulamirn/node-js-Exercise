import express from 'express';
import healthController from '../controller/health.js';

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3030;

// routes
app.get('/health', healthController.getHealth);
app.post('/health', healthController.postHealth);    


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
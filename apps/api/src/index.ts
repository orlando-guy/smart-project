import { UserSchema } from '@repo/shared';
import express from 'express';

const app = express();
const PORT = process.env.API_PORT || 4000;

app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: "Salut depuis l'API Node.js !"})
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})

/* app.post('/users', (req, res) => {

}) */
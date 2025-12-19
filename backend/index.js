const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/server');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'https://task-manager-sebas.netlify.app/' //url de el front
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));

app.get('/', (req, res ) => {
    res.send('Api de autenticacion funcionando')
});

app.listen(PORT, () => {
    console.log(`servidor corriendo en http://localhost: ${PORT}`)
});
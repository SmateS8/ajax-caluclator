import express from 'express';
const filePath = './data.json';
import indexRouter from './router/indexRouter.js';

const app = express();
app.use('/', indexRouter);
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



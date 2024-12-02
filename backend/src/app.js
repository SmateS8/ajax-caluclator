import express from 'express';
const filePath = './data.json';
import indexRouter from './router/indexRouter.js';
import cors from 'cors';
const port = 3000;

const app = express();

app.use(cors());
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



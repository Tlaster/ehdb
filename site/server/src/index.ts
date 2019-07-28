import express from 'express';
import ApiRouter from './router/api';
import cors from 'cors';

const app = express();
const port = 4929;
app.use(cors());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use('/api', ApiRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

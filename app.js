'use strict';
const express = require('express');
const cors = require('cors');
const photoRoute = require('./routes/photoRoute');
const userRoute = require('./routes/userRoute');

const app = express();
const port = 3000;
app.use(cors());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/photo', photoRoute);
app.use('/user', userRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
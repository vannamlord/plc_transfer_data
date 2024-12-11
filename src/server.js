import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoute from './route/web';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup view engine
configViewEngine(app);

//init web route
initWebRoute(app);

app.listen(port,'0.0.0.0', () => {
    console.log(`Example app listening at ${port}`)
})


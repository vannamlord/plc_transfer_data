import express from "express";
import homeController from '../controller/homeController';

const app = express();

let router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Routes
const initWebRoute = (app) => {
    router.get('/', homeController.getUploadFilePage);
    router.post('/', homeController.handleSendData);
    return app.use('/', router);
};

export default (app) => {
    initWebRoute(app);
};

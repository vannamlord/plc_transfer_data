import express from "express";
import http from "http";
import { Server as WebSocketServer } from "ws";
import net from "net";
import homeController from '../controller/homeController';
import multer from 'multer';
import path from 'path';
var appRoot = require('app-root-path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let router = express.Router();

// WebSocket Logic
wss.on('connection', (ws) => {
    console.log('WebSocket client connected.');

    ws.on('message', (message) => {
        console.log('Received from WebSocket client:', message);

        try {
            const { ip, port, data } = JSON.parse(message);

            // Validate IP and port
            if (!ip || !port || !data) {
                ws.send('Error: IP, port, or data is missing.');
                return;
            }

            const client = new net.Socket();
            client.connect(parseInt(port), ip, () => {
                console.log(`Connected to ${ip}:${port}`);
                client.write(data);
            });

            client.on('data', (responseData) => {
                console.log('Response from device:', responseData.toString());
                ws.send(`Response from device: ${responseData.toString()}`);
                client.destroy(); // Close the connection
            });

            client.on('error', (error) => {
                console.error('TCP connection error:', error.message);
                ws.send(`Error: ${error.message}`);
                client.destroy();
            });

            client.on('close', () => {
                console.log('TCP connection closed');
            });
        } catch (err) {
            console.error('Error parsing message:', err.message);
            ws.send('Error: Invalid message format.');
        }
    });

    ws.on('close', () => console.log('WebSocket client disconnected.'));
    ws.on('error', (error) => console.error('WebSocket error:', error));
});

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/src/public/image/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });

// Initialize Routes
const initWebRoute = (app) => {
    router.get('/', homeController.getUploadFilePage);
    router.get('/machine-sta', homeController.handCheckUpdateApp);
    router.post('/upload-profile-pic', upload.single('profile_pic'), homeController.handleUploadFile);
    return app.use('/', router);
};

export default (app) => {
    initWebRoute(app);
    server.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
};

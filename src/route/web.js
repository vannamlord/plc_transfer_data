import express from "express";
import net from "net";
import homeController from '../controller/homeController';

const app = express();

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // In case you're sending JSON data

let router = express.Router();

// Handle form submission
app.post('/', (req, res) => {
    const { ip, port, data } = req.body;

    // Validate input
    if (!ip || !port || !data) {
        return res.status(400).send("Error: IP, port, and data are required.");
    }

    const client = new net.Socket();
    client.connect(parseInt(port), ip, () => {
        console.log(`Connected to ${ip}:${port}`);
        client.write(data);
    });

    client.on("data", (responseData) => {
        console.log("Response from server:", responseData.toString());
        client.destroy(); // Close connection
        res.send(`Data sent successfully! Server response: ${responseData.toString()}`);
    });

    client.on("error", (error) => {
        console.error("TCP connection error:", error.message);
        client.destroy();
        res.status(500).send(`Error sending data: ${error.message}`);
    });

    client.on("close", () => {
        console.log("TCP connection closed.");
    });
});

// Initialize Routes
const initWebRoute = (app) => {
    router.get('/', homeController.getUploadFilePage);
    router.post('/', homeController.getUploadFilePage);
    return app.use('/', router);
};

export default (app) => {
    initWebRoute(app);
};

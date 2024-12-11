import express from "express";
import net from "net";
import homeController from '../controller/homeController';

const app = express();

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // In case you're sending JSON data

let router = express.Router();

// Handle form submission
// Handle form submission (this will be the form in `uploadFile.ejs`)
app.post('/send-data', (req, res) => {
    const { ip, port, data } = req.body;

    // Validate input
    if (!ip || !port || !data) {
        return res.status(400).send("Error: IP, port, and data are required.");
    }

    // Send data via TCP to the specified IP and port
    const client = new net.Socket();
    client.connect(parseInt(port), ip, () => {
        console.log(`Connected to ${ip}:${port}`);
        client.write(data); // Send the data to the TCP server
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
    router.post('/send-data', homeController.handleSendData);
    return app.use('/', router);
};

export default (app) => {
    initWebRoute(app);
};

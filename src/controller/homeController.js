import net from "net";
const fs = require('fs');
const util = require('util');

let getUploadFilePage = async (req, res) => {
    return res.render('uploadFile.ejs')
}

let handleSendData = async (req, res) => {
    const { ip, port, data } = req.body;

    // Validate the data
    if (!ip || !port || !data) {
        return res.status(400).send("Error: IP, port, and data are required.");
    }

    // Send the data over TCP
    const client = new net.Socket();
    client.setTimeout(5000); // Set a timeout of 5 seconds
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
};

module.exports = {
    getUploadFilePage, handleSendData
};
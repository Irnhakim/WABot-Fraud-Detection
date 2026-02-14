const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const WhatsAppConnection = require("./WhatsAppConnection");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 8000;

app.use(fileUpload({ createParentPath: true }));
app.use(cors());
app.use(express.static(__dirname + "/client/assets"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/scan", (req, res) => {
    res.sendFile("server.html", {
        root: __dirname + "/client"
    }, (err) => {
        if (err) {
            console.error("Error sending server.html:", err);
            res.status(err.status).end();
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile("index.html", {
        root: __dirname + "/client"
    }, (err) => {
        if (err) {
            console.error("Error sending index.html:", err);
            res.status(err.status).end();
        }
    });
});

const whatsappConnection = new WhatsAppConnection();

io.on("connection", async (socket) => {
    whatsappConnection.socket = socket;
    if (whatsappConnection.isConnected()) {
        whatsappConnection.updateQR("qrscanned");
    } else if (whatsappConnection.qr) {
        whatsappConnection.updateQR("qr");
    }
});

whatsappConnection.connect()
    .catch(err => console.log("unexpected error: " + err));

server.listen(port, () => {
    console.log("Server Berjalan pada Port : " + port);
});

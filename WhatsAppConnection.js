const {
    makeWASocket,
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    makeInMemoryStore,
    isJidBroadcast
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require('fs');
const { session } = { "session": "baileys_auth_info" };
const pino = require("pino");
const log = pino({ level: "silent" });
const qrcode = require('qrcode');
const MessageHandler = require("./MessageHandler");


class WhatsAppConnection {
    constructor() {
        this.sock = null;
        this.qr = null;
        this.store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
        this.messageHandler = new MessageHandler(); 
        this.socket = null; 
    }

    async connect() {
        const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
        let { version, isLatest } = await fetchLatestBaileysVersion();
        this.sock = makeWASocket({
            printQRInTerminal: true,
            auth: state,
            logger: log,
            version: [2, 2323, 4],
            shouldIgnoreJid: jid => isJidBroadcast(jid),
        });
        this.store.bind(this.sock.ev);
        this.sock.multi = true;
    
        this.sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const reason = new Boom(lastDisconnect.error).output.statusCode;
                console.log(`connection closed: ${reason} ${lastDisconnect.error}`);
                this.handleDisconnect(reason);
            } else if (connection === 'open') {
                console.log('opened connection');
                await this.handleOpen();
            }
            if (update.qr) {
                this.qr = update.qr;
                this.updateQR("qr");
            } else if (this.qr === undefined) {
                this.updateQR("loading");
            } else if (update.connection === "open") {
                this.updateQR("qrscanned");
            }
        });
    
        this.sock.ev.on("creds.update", saveCreds);
    
        this.sock.ev.on("messages.upsert", async ({ messages, type }) => {
            if (type === "notify") {
                await this.messageHandler.handleIncomingMessage(this.sock, messages[0]); 
            }
        });
    }
    

    handleDisconnect(reason) {
        switch (reason) {
            case DisconnectReason.badSession:
                console.log(`Bad Session File, Please Delete ${session} and Scan Again`);
                this.sock.logout();
                break;
            case DisconnectReason.connectionClosed:
                console.log("Connection closed, reconnecting....");
                this.connect();
                break;
            case DisconnectReason.connectionLost:
                console.log("Connection Lost from Server, reconnecting...");
                this.connect();
                break;
            case DisconnectReason.connectionReplaced:
                console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                this.sock.logout();
                break;
            case DisconnectReason.loggedOut:
                if (fs.existsSync(session)) {
                    try {
                        if (fs.lstatSync(session).isDirectory()) {
                            fs.rmSync(session, { recursive: true });
                        } else {
                            fs.unlinkSync(session);
                        }
                        console.log(`Device Logged Out, Session file deleted. Please scan again.`);
                    } catch (err) {
                        console.error(`Error deleting file or directory: ${err.message}`);
                    }
                } else {
                    console.log(`Session file or directory ${session} does not exist.`);
                }
                this.connect();
                break;
            case DisconnectReason.restartRequired:
                console.log("Restart Required, Restarting...");
                this.connect();
                break;
            case DisconnectReason.timedOut:
                console.log("Connection TimedOut, Reconnecting...");
                this.connect();
                break;
            default:
                console.log(`Unknown DisconnectReason: ${reason}`);
                this.connect();
                break;
        }
    }
    
    async handleOpen() {
        console.log('Connection opened successfully.');
    }

    isConnected() {
        return this.sock && this.sock.user;
    }

    updateQR(data) {
        switch (data) {
            case "qr":
                qrcode.toDataURL(this.qr, (err, url) => {
                    if (err) {
                        console.error('Error generating QR code:', err);
                    } else {
                        this.socket?.emit("qr", url); 
                        this.socket?.emit("log", "QR Code received, please scan!");
                    }
                });
                break;
            case "connected":
                this.socket?.emit("qrstatus", "./client/assets/check.svg");
                this.socket?.emit("log", "WhatsApp terhubung!");
                break;
            case "qrscanned":
                this.socket?.emit("qrstatus", "./client/assets/check.svg");
                this.socket?.emit("log", "QR Code Telah discan!");
                break;
            case "loading":
                this.socket?.emit("qrstatus", "./client/assets/loader.gif");
                this.socket?.emit("log", "Registering QR Code, please wait!");
                break;
            default:
                break;
        }
    }
}


module.exports = WhatsAppConnection;

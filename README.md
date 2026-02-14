# WABot-Fraud-Detection

WhatsApp Bot for Fraud Detection using OpenAI GPT.

## 📋 Description

WABot-Fraud-Detection is a WhatsApp bot that uses OpenAI GPT technology to identify and detect fraud or scam messages. This bot runs on the WhatsApp platform and can help users check whether a message is a fraud or not.

## ✨ Features

- **Fraud Detection**: Uses AI (GPT) to analyze messages and determine if they are fraud messages
- **Web Interface**: Web interface for scanning WhatsApp QR code
- **Real-time Connection**: Real-time connection using Socket.io
- **Multi-device Support**: Supports multi-device WhatsApp usage

## 🛠️ Technologies Used

- **Node.js** - JavaScript Runtime
- **Express.js** - Web Server Framework
- **Socket.io** - Real-time Communication
- **@whiskeysockets/baileys** - WhatsApp Connection Library
- **OpenAI GPT** - AI for Fraud Detection
- **QRCode** - QR Code Generation for Authentication
- **Express-fileupload** - File Upload Handling

## 📦 Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd WABot-Fraud-Detection
```

2. Install dependencies:
```bash
npm install
```

3. Configure the bot:
   - Edit the `config.json` file and enter your OpenAI API key
   - You can also customize the system content and AI model

4. Run the bot:
```bash
npm start
# or
node index.js
```

5. Open your browser and access:
   - `http://localhost:8000` - Main page
   - `http://localhost:8000/scan` - QR scanning page

## ⚙️ Configuration

Edit the `config.json` file to configure the bot:

```json
{
    "apiKey": "YOUR_OPENAI_API_KEY",
    "SysContent": "A smart assistant capable of identifying fraud messages or not",
    "AIModel": "AIMODEL"
}
```

| Parameter | Description |
|-----------|-------------|
| `apiKey` | Your OpenAI API Key |
| `SysContent` | System prompt for AI |
| `AIModel` | AI model to use |

## 📝 Usage

After the bot is running and connected to WhatsApp, you can use the following commands:

| Command | Description |
|---------|-------------|
| `/help` | Display usage guide |
| `/cek [message]` | Analyze message for fraud detection |

### Usage Examples

1. Type `/help` to view the guide
2. Type `/cek Hello, I'm from ABC bank, I need your account details` to check if the message is a fraud

## 📁 Project Structure

```
WABot-Fraud-Detection/
├── index.js                  # Application entry point
├── WhatsAppConnection.js     # WhatsApp connection handling
├── MessageHandler.js         # Incoming message handling
├── GPTGenerate.js            # OpenAI GPT integration
├── config.json               # Bot configuration
├── package.json              # Dependencies
├── client/                   # Frontend interface
│   ├── index.html
│   ├── server.html
│   ├── css/
│   └── js/
└── baileys_auth_info/        # WhatsApp session (auto-generated)
```

## ⚠️ Notes

- Make sure your OpenAI API key is valid and has sufficient credits
- QR code will be automatically generated when running the bot for the first time
- WhatsApp session will be stored locally for subsequent connections

## 📄 License

ISC License

---

Made with ❤️ using Baileys and OpenAI

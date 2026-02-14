
const GPTGenerate = require('./GPTGenerate');


class MessageHandler {
    constructor() {
        this.gptGenerate = new GPTGenerate(); 
    }

    async handleIncomingMessage(sock, message) {
        if (!message.key.fromMe) {
            const pesanMasuk = message.message.conversation;
            const noWa = message.key.remoteJid;
            await sock.readMessages([message.key]);

            if (pesanMasuk.includes('/cek')) {
                try {
                    const balas = await this.gptGenerate.GptResponse(pesanMasuk); 
                    await sock.sendMessage(noWa, { text: balas }, { quoted: message });
                } catch (error) {
                    console.error('Error generating response from GPT:', error);
                    await sock.sendMessage(noWa, { text: "Terjadi Kesalahan :",error }, { quoted: message });
                }
            } else if (pesanMasuk == '/help') {
                await sock.sendMessage(noWa, { text: "Hai saya adalah chatbot untuk mengidentifikasi pesan penipuan, untuk menggunakan fitur indentifikasi silahkan ketik *''/cek''* dilanjutkan dengan isi pesan yang ingin anda identifikasi" }, { quoted: message });
            } else {
                await sock.sendMessage(noWa, { text: "silahkan ketik *''/help''* untuk melihat panduan penggunaan chatbot" }, { quoted: message });
            }
        }
    }
}

module.exports = MessageHandler;

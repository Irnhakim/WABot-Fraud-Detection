const { OpenAI } = require("openai");
const fs = require('fs');
const congfig = JSON.parse(fs.readFileSync('config.json'));
const { apiKey, SysContent, AIModel } = congfig;
const openai = new OpenAI({ apiKey });

class GPTGenerate {
    
    async GptResponse(pesanMasuk) {
        try {
            const gptResponse = await openai.chat.completions.create({
                messages: [{ role: "system", content: SysContent }, { role: "user", content: pesanMasuk }],
                model: AIModel,
            });
            const balas = gptResponse.choices[0].message.content;
            return balas;
        } catch (error) {
            console.error('Error generating response from GPT:', error);
            return error;
        }
    }

}

module.exports = GPTGenerate;

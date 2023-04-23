
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { exec } = require("child_process");


const client = new Client({
  authStrategy: new LocalAuth(),
});

let minimumRupeeToAccessChat = 1;

const getCurlString = (content) =>
  `curl --location --request POST 'https://api.openai.com/v1/chat/completions' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer ' \
--data-raw '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "${content}"}],
    "temperature": 0.7
  }'`;

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready yo!");
});

client.on("message", async (msg) => {
  // return if group message
  if(msg.author) return;
  console.log(">>> msg", msg);
  
  const command = getCurlString(msg.body);

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    const parsed = JSON.parse(stdout);
    msg.reply(`${parsed.choices[0].message.content}`);
    msg.reply(`Credits Remaining: ${0}`);
  });
});

client.initialize();
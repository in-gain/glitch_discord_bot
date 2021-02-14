const discord = require("discord.js");
const http = require("http");
const queryString = require("querystring");
const axiosBase = require("axios");
const client = new discord.Client();
const prefix = "!" //命令文用のプレフィックス。誤動作防止に設定。

//Response for Uptime Robot

http.createServer((req, res) => {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function(chunk) {
        data += chunk;
      });
      req.on("end", function() {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = queryString.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(3000); //PORT3000でリッスンする。

client.on("ready", () => {
  console.log(`BOTの準備ができました。`);
});

client.on("message", message => {
  if (message.author.id === client.user.id){
    return;
  }
  console.log(message.content);
  if (message.mentions.has(client.user)) {
    if (message.content.includes("新しいスケジュール")) {
      sendGAS(message);
      console.log('GASに送ったぞ');
      return;
    }

    if(message.content.includes(`${prefix}ルーレット`)){
      const command = message.content.split(' ');
      const reset = "リセット";
      const start = "スタート";
      if(command[1].includes(`${reset}`)){
        if(command[2]){
          postData(process.env.CLOUD_FUNCTIONS_URI_RESET,data).done(async response =>{
            message.reply(response);
          }).catch(()=>{
            message.reply("エラーが発生したよ。ログを見てね。");
          })
        }else{
          postData(process.env.CLOUD_FUNCTIONS_URI_RESETALL,data).done(async response =>{
            message.reply(response);
          }).catch(()=>{
            message.reply("エラーが発生したよ。ログを見てね。");
          })
        }
      }
      if(command[1].includes(`${start}`)){
        postData(process.env.CLOUD_FUNCTIONS_URI_START,data).done(async response =>{
          message.reply(response);
        }).catch(()=>{
          message.reply("エラーが発生したよ。ログを見てね。");
        })
      }
    }
  }

  if(message.content === `<:noct_hnn_yaha:754237988225024001>`){
    message.member.voiceChannel.join().then(connection => {
      const dispatcher = connection.playFile('yaha.mp3');
      dispatcher.on('end', reason =>{
        connection.disconnect();
      });
    })
  }
});

if (!process.env.DISCORD_BOT_TOKEN) {
  console.log("discordのBOTトークンを設定してください。");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
//GoogleAppScriptへPOSTする。
const sendGAS = msg => {
  const params = msg.content.split(" ");
  const userId = params.shift();
  const value = params.join(" ");

  const jsonData = {
    userId: msg.member.id,
    value: value,
    message: msg.content,
    channelId: msg.channel.id
  };

  postData(process.env.GAS_URI, jsonData);
};

const postData = (uri, data) => {
  const responseData;
  const axios = axiosBase.create({
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    responseType: "json",
  })
  return axios.post(uri,data).catch(error =>{
    console.log(`エラーが発生しました。原因は${error}です。`);
    return Promise.reject();
  })
};

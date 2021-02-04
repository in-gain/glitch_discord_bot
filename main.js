const discord = require("discord.js");
const http = require("http");
const queryString = require("querystring");
const client = new discord.Client();

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
  if (message.author.id === "806881579322441759") {
    return;
  }

  if (message.isMemberMentioned(client.user)) {
    if (message.content.indexOf("新しいスケジュール") > 0) {
      sendGAS();
      return;
    }
  }
});

if (process.env.DISCORD_BOT_TOKEN) {
  console.log("discordのBOTトークンを設定してください。");
  process.exit(-1);
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

  postMessage(process.env.GAS_URI, jsonData);
};

const postData = (uri, jsonData) => {
  const request = require("request");
  const options = {
    uri: uri,
    headers: { "Content-type": "application/json" },
    json: jsonData,
    followAllRedirects: true
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.log("error");
      return;
    }

    const userId = response.body.userid;
    const channelId = response.body.channelid;
    const message = response.body.message;
    if (userId && channelId && message) {
      const channel = client.channels.get(channelId);
      channel?.send(message);
    }
  });
};

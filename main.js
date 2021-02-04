const DC = this;

//msgの一時退避
let msg;
let discord = require('discord.js');
let client = null;

const STATUS = {
    READY : 0,
    CONNECTING : 1,
    RECONNECTING : 2,
    IDLE : 3,
    NEARLY : 4,
    DISCONNECTED : 5,
}

//Response for Uptime Robot
const http = require('http');
http.createServer(function(request,response){
    connectDiscord();
    response.end(`BOTは現在稼働中です。`);
}).listen(3000) //PORT3000でリッスンする。

function connectDiscord(){
    console.log(`00`);

    if(client == null){
        client = new discord.Client();
    }else{
        switch(client.status){
            case STATUS.READY:
            case STATUS.CONNECTING:
            case STATUS.RECONNECTING:
            case STATUS.IDLE:
            case STATUS.NEARLY:
                return;
            case STATUS.DISCONNECTED:
                client.destroy();
                break;
            default:
                client = new discord.Client();
                break;
        }
    }
}

client.login( process.env.DISCORD_BOT_TOKEN);
client.on('ready', ()=>{
    console.log(`BOTの準備ができました。`)
})

client.on('message', message=>{
    if(message.author.id === '806881579322441759'){
        return;
    }
    msg = message;

    if(msg.isMemberMentioned(client.user)){
        if(msg.content.indexOf('新しいスケジュール') > 0){
            sendGAS();
            return;
        }
    }
});

if(process.env.DISCORD_BOT_TOKEN){
    console.log('discordのBOTトークンを設定してください。');
    process.exit(-1);
}

//GoogleAppScriptへPOSTする。
const sendGAS = msg =>{
    const params = msg.content.split(' ');
    const userId = params.shift();
    const value = params.join(' ');

    const jsonData ={
        "userId" : msg.member.id,
        "value" : value,
        "message" : msg.content,
        "channelId" : msg.channel.id,
    }

    postMessage(process.env.GAS_URI, jsonData);
}

const postData = (uri,jsonData) => {
    const request = require('request');
    const options = {
        "uri": uri,
        "headers": {"Content-type" : "application/json"},
        "json": jsonData,
        followAllRedirects: true,
    }

    request.post(options, (error, response, body) =>{
        if(error){
            msg.reply(`更新に失敗しました。`);
            return;
        }

        const userId = response.body.userid;
        const channelId = response.body.channelid,
        const mesasge = response.body.message;
        if(userId && channelId && message){
            const channel = client.channels.get(channelId);
            channel?.send(message);
        }
    });
}

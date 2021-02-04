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
            
        }
    }
})
 const idolStamp = require('./idol_stamp')
 
exports.rouletteMessage = (client,idolsArr) => {
    const ret = {
        embed: {
            author: {
                name: "new_target",
            },
            title: "仲良くなる会ルーレット",
            description:`次回仲良くなるアイドルを決めるルーレットを作成します。\n
            投票したいアイドルのリアクションを押してください。\n
            ***一人三票までで、四票以上投票した場合古い票が無効になります。***`,
            color:0x8dbbff,
            footer:{
                icon_url: client.user.avatarURL,
                text: "仲良くなる会をもっと便利にする会"
            },
            fields:[]
        }
    }
    idolsArr.forEach(idolName =>{
        ret.embed.fields.push({
            name: `${idolName}${idolStamp.stamps[idolName]}`,
            inline: true
        })
    })
    return ret;
}
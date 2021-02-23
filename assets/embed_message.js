import { idolStamp } from "./idol_stamp";

export const rouletteMessage = idolsArr => {
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
                text: "© in_gain | 仲良くなる会bot"
            },
            thumbnail:{
                url:"./curtain.jpg"
            },
            fields:[]
        }
    }
    idolsArr.forEach(idolName =>{
        ret.embed.fields.push({
            name: `${idolName}${idolStamp[idolName]}`,
            inline: true
        })
    })
    return ret;
}
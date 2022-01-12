  module.exports = {
    name: "ping",
    description: "Get bot's ping",
    alias: [""],
    run: async (client, message, args) =>{
        message.reply("`Pong! "+client.ws.ping+"ms`")
    }
}

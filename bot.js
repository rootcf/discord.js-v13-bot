const { Client, MessageEmbed, Collection, Discord, Intents, Message } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING] });
const { prefix, token } = require("./config.json")
const { readdirSync } = require('fs');

client.commands = new Collection();
client.alias = new Collection();
client.slashcommands = new Collection();

const getFiles = readdirSync("./commands").filter(file => file.endsWith('.js'))

for (let file of getFiles) {
    let pull = require(`./commands/${file}`)
    client.commands.set(pull.name, pull)
    pull.alias.forEach(_alias => client.alias.set(_alias, pull))
    console.log(`Initializing command -> ${pull.name}`)

}

client.on('messageCreate', async (message, args) => {

    let _message = message.content.split(' ');
    if (_message[0].startsWith(prefix)) {
        let _prefix = _message[0].substring(0, prefix.length)
        let command = _message[0].substring(prefix.length, _message[0].length)
        try {
            if (client.commands.has(command))
                client.commands.get(command).run(client, message, args, message.author)

            else
                client.alias.get(command).run(client, message, args, message.author)

        }
        catch (err) {
            console.log(err);
        }
    }
    else return;
})


client.on('ready', () => {
    client.user.setActivity("rootcf", { type: "STREAMING", url: "https://twitch.tv/rootcf" })
    console.log("Online!");
})

client.login(token);

const { Client, MessageEmbed, Collection, Discord, Intents, Message } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING] });
const { prefix, token, owner } = require("./config.json")
const { readdirSync } = require('fs');

client.commands = new Collection();
client.alias = new Collection();

const getFiles = readdirSync("./commands").filter(file => file.endsWith('.js'))
for (let file of getFiles) {
    let pull = require(`./commands/${file}`)
    client.commands.set(pull.name, pull)
    pull.alias.forEach(_alias => client.alias.set(_alias, pull))
    console.log(`Loading command -> ${pull.name}`)

}

client.on('messageCreate', async (message, args) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    let _message = message.content.split(' ');
    if (_message[0].startsWith(prefix)) {
        let _prefix = _message[0].substring(0, prefix.length)
        let command = _message[0].substring(prefix.length, _message[0].length)
        try {
            if (client.commands.has(command))
               if (client.commands.get(command).owneronly == 1 && message.author.id != owner)
                    return;
                else if (client.commands.get(command).owneronly == 1 && message.author.id == owner)
                    client.commands.get(command).run(client, message, args, message.author)

                else
                    client.commands.get(command).run(client, message, args, message.author)

            else
                if (client.alias.get(command).owneronly == 1 && message.author.id != owner)
                    return;
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

module.exports = {
	name: 'timeout',
	aliases: ['timer', 'contador', 'digref'],
    desc: 'pone un timer',
	run: async (client, message, args, prefix) => {

		const time = args.slice(1).join(" ");
		const ms = require('ms');

		if(!time) return message.channel.send('Por favor, especificá el tiempo!');

		const usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first();
		const milliseconds = ms(time);

		if(!usuario) return message.channel.send('Usuario no espicificado');
		if(!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) {
			return message.channel.send('Tiempo invalido, no son: 10s-28d');
		}

		const iosTime = new Date(Date.now() + milliseconds).toISOString();

		await fetch(`https://discord.com/api/guilds/${message.guild.id}/members/${usuario.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ communication_disabled_until: iosTime }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${client.token}`,
			},
		});
		message.channel.send(`\`${usuario.user.tag}\` has been timed out for \`${time}\`!`);
	},
};
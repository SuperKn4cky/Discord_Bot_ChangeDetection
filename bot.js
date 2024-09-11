import { Client, GatewayIntentBits } from 'discord.js';
import Fastify from 'fastify';

const TOKEN = process.env.DISCORD_TOKEN;
console.log(`Token: ${TOKEN}`);

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
  ],
});

const web_server = Fastify({ logger: true });

client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

async function sendDmToUsers(userIds, messageContent) {
  for (const userId of userIds) {
    try {
      const user = await client.users.fetch(userId);
      await user.send(messageContent);
      console.log(`Message envoyé à ${user.tag}`);
    } catch (error) {
      console.error(`Impossible d'envoyer le message à ${userId}`, error);
    }
  }
}

web_server.post('/send-message', async (request, reply) => {
  console.log('Query:', request.query);
  console.log('Headers:', request.headers);
  console.log('Corps:', request.body);

  const {userids} = request.query;
  const {title, message} = request.body;

    console.log('Erreur: userIds manquant');
    reply.code(400).send({error: 'userIds requis'});
    return;
  }

  let combinedMessage = `**${title}**\n\n${message}`;

  console.log(`Message envoyé: ${combinedMessage}`);

  const userIdList = userids.split(',');

  await sendDmToUsers(userIdList, combinedMessage);
  reply.send({status: 'Messages privés envoyés avec succès'});
});

const start = async () => {
  try {
    await web_server.listen({ port: 5001, host: '0.0.0.0' });
    console.log('Serveur Fastify en écoute sur le port 5001');
  } catch (err) {
    web_server.log.error(err);
    process.exit(1);
  }
};

client.login(TOKEN).then(() => {
  start();
});


import {Client, GatewayIntentBits} from 'discord.js';
import Fastify from 'fastify';

import {TOKEN} from './token_bot.js';


const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
  ],
});


const web_server = Fastify({logger: true});

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
  const {userIds} = request.query;
  const {message} = request.body;

  if (!userIds || !message) {
    reply.code(400).send({error: 'userIds et message sont requis'});
    return;
  }

  const userIdList = userIds.split(',');

  await sendDmToUsers(userIdList, message);
  reply.send({status: 'Messages privés envoyés avec succès'});
});

const start = async () => {
  try {
    await web_server.listen({port: 5001, host: '0.0.0.0'});
    console.log('Serveur Fastify en écoute sur le port 5001');
  } catch (err) {
    web_server.log.error(err);
    process.exit(1);
  }
};

client.login(TOKEN).then(() => {
  start();
});

# Discord ChangeDetection Bot - Docker Version

Ce projet utilise Docker pour déployer une API qui envoie des messages privés via un bot Discord lorsqu'un changement est détecté par [ChangeDetection.io](https://changedetection.io/).

## Prérequis

- Docker installé sur votre machine
- Un bot Discord (consultez [le guide officiel](https://discord.com/developers/docs/getting-started) pour en créer un)

## Installation et Configuration

1. Clonez ce dépôt :
   ```bash
   git clone <url-du-repo>
   cd <nom-du-repo>
   ```
2. Modifiez le fichier `docker-compose.yml` avec le token de votre bot :
 ```yaml
   services:
     discord-bot:
       image: warden696/node-changedetection-api-bot:22.3.0-alpine
       container_name: discord-bot
       environment:
         - DISCORD_TOKEN=BOT_TOKEN
       ports:
         - "5001:5001"
       restart: unless-stopped
   ```
2bis. Créez un fichier `.env` à la racine du projet avec votre token Discord :
   ```
   DISCORD_TOKEN=VOTRE_TOKEN_DISCORD
   ```

3. Modifiez le fichier `docker-compose.yml` si nécessaire :
   ```yaml
   services:
     discord-bot:
       image: warden696/node-changedetection-api-bot:22.3.0-alpine
       container_name: discord-bot
       environment:
         - DISCORD_TOKEN=${DISCORD_TOKEN}
       ports:
         - "5001:5001"
       restart: unless-stopped
   ```

## Lancer le projet

1. Démarrez le conteneur avec Docker Compose :
   ```bash
   docker-compose up -d
   ```

2. Le serveur sera accessible à `http://localhost:5001`.

## Utilisation avec ChangeDetection.io

Configurez ChangeDetection.io pour envoyer une requête POST à votre serveur :

- **Notification URL** : `post://<votre-ip>:5001/send-message?userids=<userID1>,<userID2>,...`
- **Corps de la notification** :
  ```json
  {
    "title": "ChangeDetection.io Notification - {{watch_url}}",
    "message": "{{diff|tojson}}"
  }
  ```

Cela enverra un message aux utilisateurs Discord spécifiés lorsque ChangeDetection.io détecte un changement.

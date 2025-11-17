import { WebhookClient } from 'discord.js';
import dotenv from 'dotenv';
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');
dotenv.config();


const bossa = "sgc-musikhjaelpen"

const webhookUrl = process.env.WEBHOOK_URL;

const webhookClient = new WebhookClient({ url: webhookUrl! });

const sentTimestamps = [] as string[];

setInterval(async () => {
    const res = await fetch("https://musikapi.lukasabbe.com/api/collection/" + bossa);
    const data = await res.json();
    for (const donator of data.donators){
        if(!sentTimestamps.includes(donator.timestamp)){
            const message = `Tack så mycket till ${donator.name == "" ? "En hemlig hjälte" : donator.name} som har donerat ${donator.amount} kr till SGCs bössa i Musikhjälpen!`;
            await webhookClient.send({
                content: message
            });
            sentTimestamps.push(donator.timestamp);
        }
    }
}, 1000 * 30); // Check every 30 seconds
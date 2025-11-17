import { WebhookClient } from 'discord.js';
import dotenv from 'dotenv';
import { setDefaultResultOrder } from 'dns';
import fs from 'fs';
setDefaultResultOrder('ipv4first');
dotenv.config();


const bossa = "sgc-musikhjaelpen"

const webhookUrl = process.env.WEBHOOK_URL;

const webhookClient = new WebhookClient({ url: webhookUrl! });

const sentTimestamps = [] as string[];

if(!fs.existsSync("sentTimestamps.json")){
    fs.writeFileSync("sentTimestamps.json", JSON.stringify(sentTimestamps));
} else {
    const fileData = fs.readFileSync("sentTimestamps.json", "utf-8");
    sentTimestamps.push(...JSON.parse(fileData));
}

setInterval(async () => {
    const res = await fetch("https://musikapi.lukasabbe.com/api/collection/" + bossa);
    const data = await res.json();
    for (const donator of data.donators){
        if(!sentTimestamps.includes(donator.timestamp)){
            const message = `Tack så mycket till ${donator.name == "" ? "En hemlig hjälte" : donator.name} som har donerat ${donator.hidden_amount ? "en gåva" : donator.amount + " kr"} till SGCs bössa i Musikhjälpen! Totalt har vi nu samlat ihop ${data.amount} kr!`;
            await webhookClient.send({
                content: message
            });
            sentTimestamps.push(donator.timestamp);
            fs.writeFileSync("sentTimestamps.json", JSON.stringify(sentTimestamps));
        }
    }
}, 1000 * 30); // Check every 30 seconds
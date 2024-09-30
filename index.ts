import { LocalAuth } from "whatsapp-web.js";
import { processTasksAndSendMessages } from "./utils/process-task";
import { initializeClient, handleClientEvents } from "./client/whatsapp";

const groupId = "120363320421332904@g.us";

// Initialize the WhatsApp client
const client = initializeClient({
	authStrategy: new LocalAuth({
		clientId: "client-one",
		dataPath: "./whatsapp-sessions",
	}),
	puppeteer: {
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		timeout: 120000, // Increase timeout if necessary
		executablePath:
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	},
});

handleClientEvents(client);

// Run the main process when the client is ready
client.on("ready", async () => {
	console.log("Client is ready!");
	await processTasksAndSendMessages(client, groupId);
});

client.initialize();

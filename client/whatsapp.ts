import { Client, type ClientOptions } from "whatsapp-web.js";

export function initializeClient(options: ClientOptions): Client {
	return new Client(options);
}

export function handleClientEvents(client: Client): void {
	client.on("qr", (qr) => {
		console.log("QR Code received, please scan with your phone:");
		require("qrcode-terminal").generate(qr, { small: true });
	});

	client.on("authenticated", () => {
		console.log("Authenticated successfully");
	});

	client.on("auth_failure", (msg) => {
		console.error("Authentication failed:", msg);
		console.log("Please restart the script to re-authenticate.");
	});

	client.on("disconnected", (reason) => {
		console.log("Client was logged out due to:", reason);
		console.log("Attempting to reconnect...");
		client.initialize();
	});

	client.on("reconnecting", () => {
		console.log("Reconnecting to WhatsApp...");
	});

	process.on("SIGINT", async () => {
		console.log(
			"Caught interrupt signal (Ctrl + C), shutting down gracefully...",
		);
		try {
			await client.destroy();
			console.log("WhatsApp client and Puppeteer browser closed");
		} catch (error) {
			console.error("Error closing WhatsApp client:", error);
		} finally {
			process.exit(0);
		}
	});
}

import type { Client } from "whatsapp-web.js";

export function sendWhatsAppMessage(
	client: Client,
	message: string,
	phoneNumber: string,
) {
	if (!phoneNumber) {
		console.error("Phone number is not set. Please set a valid phone number.");
		return;
	}

	const formattedPhoneNumber = `${phoneNumber.replace(/\D/g, "")}@c.us`;

	client
		.sendMessage(formattedPhoneNumber, message)
		.then((response) => {
			console.log(
				`Message sent successfully: ID - ${response.id.id}, To - ${response.to}`,
			);
		})
		.catch((err) => {
			console.error("Failed to send message:", err.message || err);
		});
}

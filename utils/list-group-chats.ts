import type { Client, Chat } from "whatsapp-web.js";

export async function listGroupChats(client: Client) {
	try {
		console.log("Looking all group chats:");
		const chats: Chat[] = await client.getChats();
		const groupChats = chats.filter((chat) => chat.isGroup);

		console.log("Listing all group chats:");
		for (const group of groupChats) {
			console.log(
				`Group Name: ${group.name}, Group ID: ${group.id._serialized}`,
			);

			// Check if this group is named "Reminders"
			if (group.name.toLowerCase() === "reminders") {
				console.log(
					`Found "Reminders" group! Group ID: ${group.id._serialized}`,
				);
			}
		}

		if (!groupChats.some((group) => group.name.toLowerCase() === "reminders")) {
			console.log('No group named "Reminders" found.');
		}
	} catch (error) {
		console.error("Error fetching group chats:", error);
	}
}

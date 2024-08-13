import { loadPreviousBoardData, saveNewBoardData } from "./board-storage";
import { getBoardTasks } from "../client/trello";
import { filterTasksForToday, filterTasksForThisWeek } from "./task-filters";
import type { Client } from "whatsapp-web.js";

const boardId = "6671b12d8f092446641b6503";

export async function processTasksAndSendMessages(
	client: Client,
	groupId: string,
): Promise<void> {
	try {
		const previousData = loadPreviousBoardData();
		const tasks = await getBoardTasks(boardId);

		if (JSON.stringify(previousData) !== JSON.stringify(tasks)) {
			console.log("Board data has changed, updating the saved data...");
			saveNewBoardData(tasks);
		} else {
			console.log("Board data has not changed");
		}

		const todayTasks = filterTasksForToday(tasks);
		const weekTasks = filterTasksForThisWeek(tasks);

		sendWhatsAppMessage(
			client,
			groupId,
			`Tasks due today:\n${JSON.stringify(todayTasks, null, 2)}`,
		);
		sendWhatsAppMessage(
			client,
			groupId,
			`Tasks due this week:\n${JSON.stringify(weekTasks, null, 2)}`,
		);
	} catch (error) {
		console.error("Error during processing tasks:", error);
	}
}

function sendWhatsAppMessage(
	client: Client,
	groupId: string,
	message: string,
): void {
	if (!groupId) {
		console.error("Group ID is not set. Please set a valid group ID.");
		return;
	}

	client
		.sendMessage(groupId, message)
		.then((response) => {
			console.log(
				`Message sent successfully: ID - ${response.id.id}, To - ${response.to}`,
			);
		})
		.catch((err) => {
			console.error("Failed to send message:", err.message || err);
		});
}

import { loadPreviousBoardData, saveNewBoardData } from "./board-storage";
import { getBoardTasks } from "../client/trello";
import {
	filterTasksFromListsForThisWeek,
	filterTasksFromListsForToday,
	filterTasksFromListsForTomorrow,
} from "./task-filters";
import type { Client } from "whatsapp-web.js";
import type { TrelloBoardElement } from "../types/board";

// const boardId = "6671b12d8f092446641b6503";
const boardId = "66b859bc3f525f2e2d32ed3a";

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

		const todayDueTasks = filterTasksFromListsForToday(tasks);
		const tomorrowDueTasks = filterTasksFromListsForTomorrow(tasks);
		const weekDueTasks = filterTasksFromListsForThisWeek(tasks);

		sendWhatsAppMessage(
			client,
			groupId,
			formatTasksMessage("today", todayDueTasks),
		);

		sendWhatsAppMessage(
			client,
			groupId,
			formatTasksMessage("tomorrow", tomorrowDueTasks),
		);

		sendWhatsAppMessage(
			client,
			groupId,
			formatTasksMessage("week", weekDueTasks),
		);
	} catch (error) {
		console.error("Error during processing tasks:", error);
	}
}

function formatTasksMessage(due: string, tasks: TrelloBoardElement[]): string {
	let message = `*Tasks due ${due}*:\n`;

	for (const task of tasks) {
		for (const card of task.cards) {
			message += `- ${card.name} (Status: ${task.listName}, Due: ${card.due?.toLocaleDateString()})\n`;
		}
	}

	return message;
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
		.then(async (response) => {
			console.log(
				`Message sent successfully: ID - ${response.id.id}, To - ${response.to}`,
			);
			await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
		})
		.catch((err) => {
			console.error("Failed to send message:", err.message || err);
		});
}

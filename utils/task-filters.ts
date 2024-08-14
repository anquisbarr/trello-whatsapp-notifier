import { isThisWeek, isToday, parseISO } from "date-fns";
import type { TrelloBoardElement } from "../types/board";

export function filterTasksForToday(tasks: TrelloBoardElement[]) {
	return tasks.flatMap((list) =>
		list.cards.filter((card) => {
			if (card.due) {
				const dueDate =
					typeof card.due === "string" ? parseISO(card.due) : card.due;
				console.log(`Checking date: ${dueDate} for task: ${card.name}`);
				return isToday(dueDate);
			}
			return false;
		}),
	);
}

export function filterTasksForThisWeek(tasks: TrelloBoardElement[]) {
	return tasks.flatMap((list) =>
		list.cards.filter((card) => {
			if (card.due) {
				const dueDate =
					typeof card.due === "string" ? parseISO(card.due) : card.due;
				console.log(`Checking date: ${dueDate} for task: ${card.name}`);
				return isThisWeek(dueDate, { weekStartsOn: 1 }); // Week starts on Monday
			}
			return false;
		}),
	);
}

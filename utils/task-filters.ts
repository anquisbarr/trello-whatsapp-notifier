import { isThisWeek, isToday, isTomorrow, parseISO } from "date-fns";
import type { TrelloBoardElement } from "../types/board";

export function filterTasksForToday(tasks: TrelloBoardElement[]) {
	return tasks.flatMap((list) =>
		list.cards.filter((card) => {
			if (card.due) {
				const dueDate =
					typeof card.due === "string" ? parseISO(card.due) : card.due;
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
				return isThisWeek(dueDate, { weekStartsOn: 1 }); // Week starts on Monday
			}
			return false;
		}),
	);
}

// const listNamesToFilter = ["Tareas pendientes * fecha", "En proceso", "Hecho"];
// const listNamesToFilter = ["Backlog", "To Do", "Doing"] as const;
const listNamesToFilter = new Set(["Tareas pendientes", "En proceso"]);

export function filterTasksFromListsForToday(tasks: TrelloBoardElement[]) {
	return tasks.reduce((acc, list) => {
		if (listNamesToFilter.has(list.listName)) {
			const dueToday = list.cards.filter((card) => {
				if (card.due) {
					const dueDate =
						typeof card.due === "string" ? parseISO(card.due) : card.due;
					return isToday(dueDate);
				}
				return false;
			});

			if (dueToday.length > 0) {
				acc.push({
					id: list.id,
					listName: list.listName,
					cards: dueToday,
				});
			}
		}
		return acc;
	}, [] as TrelloBoardElement[]);
}

export function filterTasksFromListsForTomorrow(tasks: TrelloBoardElement[]) {
	return tasks.reduce((acc, list) => {
		if (listNamesToFilter.has(list.listName)) {
			const dueToday = list.cards.filter((card) => {
				if (card.due) {
					const dueDate =
						typeof card.due === "string" ? parseISO(card.due) : card.due;
					return isTomorrow(dueDate);
				}
				return false;
			});

			if (dueToday.length > 0) {
				acc.push({
					id: list.id,
					listName: list.listName,
					cards: dueToday,
				});
			}
		}
		return acc;
	}, [] as TrelloBoardElement[]);
}

export function filterTasksFromListsForThisWeek(tasks: TrelloBoardElement[]) {
	return tasks.reduce((acc, list) => {
		if (listNamesToFilter.has(list.listName)) {
			const dueThisWeek = list.cards.filter((card) => {
				if (card.due) {
					const dueDate =
						typeof card.due === "string" ? parseISO(card.due) : card.due;
					return isThisWeek(dueDate, { weekStartsOn: 1 }) && !isToday(dueDate);
				}
				return false;
			});

			if (dueThisWeek.length > 0) {
				acc.push({
					id: list.id,
					listName: list.listName,
					cards: dueThisWeek,
				});
			}
		}
		return acc;
	}, [] as TrelloBoardElement[]);
}

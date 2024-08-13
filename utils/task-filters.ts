import { isToday, parseISO, isThisWeek } from "date-fns";

// Function to filter tasks that are due today
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function filterTasksForToday(tasks: any) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return tasks.flatMap((list: any) =>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		list.cards.filter((card: any) => card.due && isToday(parseISO(card.due))),
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function filterTasksForThisWeek(tasks: any) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return tasks.flatMap((list: any) =>
		list.cards.filter(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(card: any) =>
				card.due && isThisWeek(parseISO(card.due), { weekStartsOn: 1 }),
		),
	);
}

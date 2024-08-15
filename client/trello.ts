import axios from "axios";
import { env } from "../env";
import { saveNewBoardData } from "../utils/board-storage";
import {
	CardSchema,
	TrelloBoardElementsSchema,
	type Card,
	type TrelloBoardElement,
	type TrelloList,
} from "../types/board";

const TRELLO_API_KEY = env.TRELLO_API_KEY;
const TRELLO_API_TOKEN = env.TRELLO_API_TOKEN;
const TRELLO_API_BASE_URL = env.TRELLO_API_BASE_URL;

export async function getBoardLists(
	boardId: string,
): Promise<TrelloBoardElement[]> {
	try {
		const response = await axios.get(
			`${TRELLO_API_BASE_URL}/boards/${boardId}/lists`,
			{
				params: {
					key: TRELLO_API_KEY,
					token: TRELLO_API_TOKEN,
				},
			},
		);

		if (response.data === "invalid id") {
			console.error("Invalid boardId or you don't have access to this board.");
			throw new Error("Invalid boardId or access denied.");
		}

		const boardData = response.data as TrelloList[];

		// Map the Trello lists to the expected structure
		const lists = boardData.map((list) => {
			return {
				id: list.id,
				listName: list.name,
				cards: [],
			};
		});

		// Validate and save the board data
		const validatedData = TrelloBoardElementsSchema.parse(lists);
		saveNewBoardData(validatedData);

		return validatedData;
	} catch (error) {
		console.error("Error fetching board lists:", error);
		throw error;
	}
}

// Function to get cards in a specific list
export async function getListCards(listId: string): Promise<Card[]> {
	try {
		const response = await axios.get(
			`${TRELLO_API_BASE_URL}/lists/${listId}/cards`,
			{
				params: {
					key: TRELLO_API_KEY,
					token: TRELLO_API_TOKEN,
				},
			},
		);

		if (response.data === "invalid id") {
			console.error("Invalid listId or you don't have access to this list.");
			throw new Error("Invalid listId or access denied.");
		}

		const cards = response.data.map((card: Card) => ({
			id: card.id,
			name: card.name,
			due: card.due ? new Date(card.due) : null,
			url: card.url,
		}));

		return CardSchema.array().parse(cards);
	} catch (error) {
		console.error("Error fetching list cards:", error);
		throw error;
	}
}

// Function to get all cards and their respective lists on a board and save the data
export async function getBoardTasks(
	boardId: string,
): Promise<TrelloBoardElement[]> {
	try {
		const lists = await getBoardLists(boardId);
		const tasks: TrelloBoardElement[] = await Promise.all(
			lists.map(async (list) => {
				const cards = await getListCards(list.id); // Use list ID correctly
				return {
					id: list.id, // Ensure the list ID is included
					listName: list.listName,
					cards: CardSchema.array().parse(cards), // Validate cards structure
				};
			}),
		);

		// Validate and save the task data
		const validatedTasks = TrelloBoardElementsSchema.parse(tasks);
		saveNewBoardData(validatedTasks);

		return validatedTasks;
	} catch (error) {
		console.error("Error fetching board tasks:", error);
		throw error;
	}
}

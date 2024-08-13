import { z } from "zod";

// Card Schema - Defines the structure of a Trello card
export const CardSchema = z.object({
	id: z.string(), // The unique ID of the card
	name: z.string(), // The name/title of the card
	due: z.date().nullable(),
	url: z.string(), // The short URL of the card
});
export type Card = z.infer<typeof CardSchema>; // Type inference for the Card schema

// TrelloBoardElement Schema - Defines the structure of each list on a Trello board
export const TrelloBoardElementSchema = z.object({
	id: z.string(), // The ID of the list
	listName: z.string(), // The name of the list
	cards: z.array(CardSchema), // An array of cards that belong to this list
});
export type TrelloBoardElement = z.infer<typeof TrelloBoardElementSchema>; // Type inference for the TrelloBoardElement schema

// TrelloBoardElements Schema - An array of TrelloBoardElements
export const TrelloBoardElementsSchema = z.array(TrelloBoardElementSchema);
export type TrelloBoardElements = z.infer<typeof TrelloBoardElementsSchema>; // Type inference for the array of TrelloBoardElement schema

export interface TrelloList {
	id: string; // Assuming each list has a unique ID
	name: string; // The name of the list
}

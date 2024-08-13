import fs from "node:fs";
import path from "node:path";
import type { TrelloBoardElement } from "../types/board";

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE_PATH = path.join(DATA_DIR, "trello_board_data.json");

// Ensure the data directory exists
function ensureDataDirectoryExists() {
	if (!fs.existsSync(DATA_DIR)) {
		fs.mkdirSync(DATA_DIR, { recursive: true });
	}
}

export function loadPreviousBoardData() {
	ensureDataDirectoryExists(); // Ensure the directory exists before trying to read the file
	if (fs.existsSync(DATA_FILE_PATH)) {
		const data = JSON.parse(fs.readFileSync(DATA_FILE_PATH, "utf-8"));
		console.log("Previous board data loaded from file");
		return data;
	}
	console.log("No previous board data found");
	return null;
}

// biome-ignore lint/suspicious/noExplicitAny: This function is used to save the board data to a file
export function saveNewBoardData(data: any) {
	ensureDataDirectoryExists(); // Ensure the directory exists before trying to save the file
	fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
	console.log(`New board data saved to ${DATA_FILE_PATH}`);
}

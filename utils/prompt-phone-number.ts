import readline from "node:readline";

type Callback = () => void;

export function promptForPhoneNumber(callback: Callback) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question("Enter phone number (including country code): ", (input) => {
		const phoneNumber = input.replace(/\D/g, "");
		console.log(`Phone number set to: ${phoneNumber}`);
		rl.close();
		callback(); // Proceed to initialize the WhatsApp client
	});
}

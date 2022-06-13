// Make sure things (history, state, etc.) are updated to the latest formats

import init from "./init.mjs";
import format_history from "./history.mjs";
import format_state from "./state.mjs";


chrome.runtime.onInstalled.addListener(async () => {
	await init();

	format_history();
	format_state();
});

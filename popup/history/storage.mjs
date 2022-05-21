// Stores and fetches calculator history
// Format: { input: String, result: { values: [Number | String], errors: [Err] } }


const HistoryStorage = {
	storage: ('chrome' in window) ? chrome.storage : console.error("TODO: load Storage API"),


	// Only called when a new equation or result is calculated, so we don't have to check for duplicates here
	push(input, values, errors) {
		this.storage.local.get(['history'], items => {
			items = items.history;

			items.unshift({
				input,
				result: { values, errors }
			});

			// Limit to last 25 items
			while(items.length > 25) items.pop();

			this.storage.local.set({ history: items });
		});
	},


	// Fetches the most recent entry
	async last() {
		return new Promise(res => {
			this.storage.local.get(['history'], items => {
				res(items.history[0] ?? null);
			});
		});
	},

	async all() {
		return new Promise(res => {
			this.storage.local.get(['history'], items => {
				res(items.history);
			});
		});
	}
};


export default HistoryStorage;

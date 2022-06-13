// Keep all calculator history formatting up-to-date
// Current format: { input: String, result: { values: [Number | String], errors: [Err] } }


export default function() {
	chrome.storage.local.get(['history'], items => {
		console.info("Format History:", items);

		let updated = [];
		let update_count = 0;

		for(let i in items.history) {
			const item = items.history[i];

			// Old format
			if('equation' in item) {
				update_count++;

				updated.push({
					input: item.equation,
					result: {
						values: item.result.split(', '),
						errors: [] // No error locations were stored, so this might as well be empty
					}
				});
			}

			// New format, no change
			else updated.push(item);
		}

		chrome.storage.local.set({ history: updated }, () => {
			console.info(`Updated history: Formatted ${update_count} items`);
		});
	});
}

// Keep all calculator history formatting up-to-date
// Current format: { input: String, result: { values: [Number | String], errors: [Err] } }


export default function() {
	chrome.storage.local.get(['angle'], data => {
		console.info("Format State:", data);

		if(data.angle.length > 3) {
			const updated_angle = data.angle === 'degrees' ? 'Deg' : 'Rad';

			chrome.storage.local.set({ angle: updated_angle }, () => {
				console.info("Updated angle state");
			});
		}
	});
}

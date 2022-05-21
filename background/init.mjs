// Initialize storage keys


export default async function() {
	return new Promise(res => {
		chrome.storage.local.get(['active', 'angle', 'history'], async data => {
			let init = {};

			if(!('active' in data))
				init.active = "";
			if(!('angle' in data))
				init.angle = "Rad";
			if(!('history' in data))
				init.history = [];

			await chrome.storage.local.set(init);

			console.log("Initialized storage entries:", init);
			res();
		});
	});
}

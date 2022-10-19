// A simple EventEmitter


class EventEmitter {
	#listeners = {};

	constructor() {}

	emit(event, ...args) {
		for(let l in this.#listeners[event])
			this.#listeners[event][l].callback(...args);

		this.#listeners[event] =
			this.#listeners[event].filter(l => !l.once);
	}

	on(event, callback) {
		if(!(event in this.#listeners))
			this.#listeners[event] = [];

		this.#listeners[event].push({ callback, once: false });
	}

	once(event, callback=null) {
		if(!(event in this.#listeners))
			this.#listeners[event] = [];

		if(callback !== null)
			this.#listeners[event].push({ callback, once: true });
		else
			return new Promise(res => { this.once(event, res); });
	}
}


export default EventEmitter;

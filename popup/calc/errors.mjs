const ErrorDisplay = {
	error_element: null,
	message_element: null,
	has_errors: false,


	init() {
		window.addEventListener('keydown', ev => {
			if(ev.key === 'Shift')
				this.error_element.setAttribute('data-active', 'true');
		});

		window.addEventListener('keyup', ev => {
			if(ev.key === 'Shift') {
				this.error_element.setAttribute('data-active', 'false');
				this._hide_message();
			}
		});
	},


	// Generate an array of source / error sections
	get_sections(source, errors) {
		let sections = [];
		let src = 0; // Source index

		for(let e in errors) {
			const start = src;
			src = errors[e].location.start;

			if(start < src)
				sections.push({ type: 'text', text: source.substring(start, src) });

			sections.push({
				type: 'error',
				text: source.substring(src, errors[e].location.end + 1),
				error: errors[e]
			});

			src = errors[e].location.end + 1;
		}

		if(src < source.length)
			sections.push({ type: 'text', text: source.substring(src) });

		return sections;
	},

	// Display errors
	display_sections(sections) {
		const elements = [];

		for(let s in sections) {
			const el = document.createElement('pre');
			el.classList.add(`section-${sections[s].type}`);
			el.innerText = sections[s].text;

			if(sections[s].type === 'error') {
				el.addEventListener('mouseover', this._display_message.bind(this, el, sections[s]));
				el.addEventListener('mouseout', this._hide_message.bind(this));
			}

			elements.push(el);
		}

		this.error_element.replaceChildren(...elements);
		this.has_errors = true;
	},

	// Remove all sections
	clear_display() {
		this.error_element.replaceChildren();
		this.has_errors = false;
	},


	// Display an error message when the user hovers over an error
	_display_message(element, section) {
		this.message_element.classList.remove('hidden');
		this.message_element.children[0].innerText = section.error.message;

		const bounds = element.getBoundingClientRect();
		const msg = this.message_element.getBoundingClientRect();
		const body = document.body.getBoundingClientRect();

		if(bounds.left + msg.width > body.width)
			this.message_element.style.left = bounds.right - msg.width + 'px';
		else
			this.message_element.style.left = bounds.left + 'px';
	},

	_hide_message() {
		this.message_element.classList.add('hidden');
		this.message_element.children[0].innerText = "";
	},


	set_elements(error_element, message_element) {
		this.error_element = error_element;
		this.message_element = message_element;
	}
};


ErrorDisplay.init();
export default ErrorDisplay;

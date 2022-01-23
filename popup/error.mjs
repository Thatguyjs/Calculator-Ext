// Copyright (c) 2022 Thatguyjs All Rights Reserved.

function el(selector) {
	return document.querySelector(selector);
}


// const input = el('#input');
const error_display = el('#error-display');
const message_popup = el('#error-message-popup');
const message_text = el('#error-message');


const ErrorHandler = {
	// Count the total # of characters across multiple sections
	_section_chars(sections) {
		let total = 0;

		for(let s in sections)
			if(typeof sections[s] === 'string')
				total += sections[s].length;
			else
				total += sections[s].data.length;

		return total;
	},

	// Generate sections of the source (calc. input) from a list of ranges
	source_sections(source, ranges) {
		let sections = [];
		let range_ind = 0;
		let ind = 0;

		while(ind < source.length) {
			if(ranges[range_ind] && ranges[range_ind].start === ind) {
				sections.push({
					index: range_ind,
					data: source.slice(ind, ranges[range_ind].end + 1),
					message: ranges[range_ind].message
				});

				ind = ranges[range_ind++].end + 1;
			}
			else if(ranges[range_ind]) {
				sections.push(source.slice(ind, ranges[range_ind].start));
				ind = ranges[range_ind].start;
			}
			else {
				sections.push(source.slice(ind));
				ind = source.length;
			}
		}

		return sections;
	},

	// Create input elements from an array of sections
	create_inputs(sections) {
		let elements = [];

		for(let s in sections) {
			const container = document.createElement('div');
			const elem = document.createElement('pre');

			if(typeof sections[s] === 'object') {
				container.classList.add('error-section');
				elem.innerText = sections[s].data;

				elem.contentEditable = 'true';
				elem.spellcheck = false;

				container.addEventListener('mouseover', this.error_popup.bind(this, sections[s].message));
				container.addEventListener('mouseout', this.error_popup_close);

				// Correctly position the cursor in the input field
				/*
				container.addEventListener('click', () => {
					const position = document.getSelection();
					const total = this._section_chars(sections.slice(0, +s));

					if(position.focusOffset < position.anchorOffset)
						input.setSelectionRange(position.focusOffset + total, position.anchorOffset + total);
					else
						input.setSelectionRange(position.anchorOffset + total, position.focusOffset + total);

					input.focus();
				});
				*/
			}
			else elem.innerText = sections[s];

			container.appendChild(elem);
			elements.push(container);
		}

		return elements;
	},

	// Show the error message popup
	error_popup(message, ev) {
		message_text.innerText = message;
		message_popup.classList.remove('hidden');

		const msg_bounds = message_popup.getBoundingClientRect();
		const err_bounds = ev.currentTarget.getBoundingClientRect();

		message_popup.style.top = (err_bounds.top + 4) + 'px';

		if(msg_bounds.width + err_bounds.left < document.body.clientWidth) {
			message_popup.style.left = err_bounds.left + 'px';
			message_popup.style.right = '';
		}
		else {
			message_popup.style.left = '';
			message_popup.style.right = (document.body.clientWidth - err_bounds.right) + 'px';
		}
	},

	error_popup_close() {
		message_popup.classList.add('hidden');
	},

	// Display error underlines and messages from an array of calculator results
	display_errors(source, results) {
		let ranges = [];

		for(let r in results) {
			if(results[r].error.has_error() && results[r].error.location.start !== null)
				ranges.push({
					...results[r].error.location,
					index: +r,
					message: results[r].error.message
				});
		}

		const sections = this.source_sections(source, ranges);
		const elements = this.create_inputs(sections);

		for(let e in elements)
			error_display.appendChild(elements[e]);
	},

	clear() {
		error_display.replaceChildren();
		this.error_popup_close();
	}
};


export default ErrorHandler;

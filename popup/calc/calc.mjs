import ErrorDisplay from "./errors.mjs";
import Input from "../input.mjs";

import addons from "./addons.mjs";
import Calculator from "/Calc-JS/src/include.mjs";


const Calc = {
	error_element: null,


	display_errors(source, errors) {
		const sections = ErrorDisplay.get_sections(source, errors);
		ErrorDisplay.display_sections(sections);
	},

	eval_and_display(input) {
		if(input.trim().length === 0) return;
		ErrorDisplay.clear_display(); // Just in case it wasn't already cleared

		const results = Calculator.eval(input, addons);
		let values = [];
		let errors = [];

		// Collect values & errors
		for(let r in results) {
			if(results[r].error.has_error())
				errors.push(results[r].error);
			else {
				if(Array.isArray(results[r].value))
					values.push('[' + results[r].value.join(', ') + ']');
				else
					values.push(results[r].value);
			}
		}

		// No errors, display result
		if(errors.length === 0)
			Input.value = values.join(', ');

		// Display errors
		else this.display_errors(input, errors);

		return { values, errors };
	},


	set_elements(error_element, message_element) {
		this.error_element = error_element;

		Input.on('update', () => {
			if(ErrorDisplay.has_errors)
				ErrorDisplay.clear_display();
		});

		ErrorDisplay.set_elements(error_element, message_element);
	}
};


export default Calc;

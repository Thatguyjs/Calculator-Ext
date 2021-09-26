// Constants and functions for the calculator

import { Token } from "../Calc-JS/src/include.mjs";

// Substitute for `./buttons.mjs`
const Buttons = { getAngleMode: () => { return 'radians'; } };


// Allow functions to take token input
function tk_wrap(call) {
	return function(...tokens) {
		let nums = [];

		for(let t in tokens) {
			if(tokens[t].modifier.negative) {
				tokens[t].data = -tokens[t].data;
				tokens[t].modifier.negative = false;
			}

			nums.unshift(tokens[t].data);
		}

		return [new Token(Token.Number, call(...nums))];
	}
}


// Join token data together into a string (for macros)
function join_tokens(tokens) {
	let str = "";

	for(let t in tokens)
		str += tokens[t].data.toString();

	return str;
}


const addons = {
	constants: {
		"pi": Math.PI,
		"e": Math.E
	},


	functions: {
		abs: Math.abs,

		rand: (min=1, max=0) => {
			if(max < min) {
				let tmp = max;
				max = min;
				min = tmp;
			}

			return Math.random() * (max - min) + min;
		},

		sum: (...nums) => {
			let total = 0;

			for(let n in nums)
				total += nums[n];

			return total;
		},

		sumrange: (start, stop) => {
			if(stop < start) {
				let tmp = start;
				start = stop;
				stop = tmp;
			}

			let total = 0;

			for(let i = start; i <= stop; i++)
				total += i;

			return total;
		},

		sqrt: Math.sqrt,
		cbrt: Math.cbrt,

		floor: Math.floor,
		round: Math.round,
		ceil: Math.ceil,

		sin: (value) => {
			if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
			return Math.sin(value);
		},
		asin: (value) => {
			let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
			return Math.asin(value) * mult;
		},

		cos: (value) => {
			if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
			return Math.cos(value);
		},
		acos: (value) => {
			let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
			return Math.acos(value) * mult;
		},

		tan: (value) => {
			if(Buttons.getAngleMode() === 'degrees') value *= Math.PI / 180;
			return Math.tan(value);
		},
		atan: (value) => {
			let mult = Buttons.getAngleMode() === 'degrees' ? 180 / Math.PI : 1;
			return Math.atan(value) * mult;
		},

		log: Math.log10,
		ln: Math.log
	},


	macros: {
		hex: (tokens) => {
			return [new Token(Token.Number, Number(`0x${join_tokens(tokens)}`), { negative: false })];
		},
		oct: (tokens) => {
			return [new Token(Token.Number, Number(`0o${join_tokens(tokens)}`), { negative: false })];
		},
		bin: (tokens) => {
			return [new Token(Token.Number, Number(`0b${join_tokens(tokens)}`), { negative: false })];
		},

		foreach: (var_def, var_cmp, equation) => {

		}
	}
};


for(let f in addons.functions) {
	addons.functions[f] = tk_wrap(addons.functions[f]);
}

export default addons;

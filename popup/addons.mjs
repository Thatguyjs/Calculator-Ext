// Copyright (c) 2021 Thatguyjs All Rights Reserved.
// Constants and functions for the calculator

import Calculator, { Token, Err } from "../Calc-JS/src/include.mjs";
import Converter from "./convert.mjs";

let Buttons = null;

if(typeof window !== 'undefined')
	Buttons = (await import("./buttons.mjs")).default;
else
	Buttons = { getAngleMode: () => { return 'radians'; } };


// Allow functions to take token input
function tk_wrap(call) {
	return function(...tokens) {
		let nums = [];

		for(let t in tokens) {
			if(tokens[t].modifier.negative) {
				tokens[t].data = -tokens[t].data;
				tokens[t].modifier.negative = false;
			}

			nums.push(tokens[t].data);
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

// Extract the inner value of a token
function parse(token, type) {
	switch(type) {
		case Token.Number:
			if(token.modifier.negative) return -token.data;
			else return token.data;

		case Token.List:
			if(token.modifier.negative) return token.data.map(n => -n);
			else return token.data;

		case Token.Name:
			return token.data;

		default:
			return null;
	}
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

		max: (...args) => Math.max.apply(Math, args),
		min: (...args) => Math.min.apply(Math, args),

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
		ln: Math.log,

		// https://en.wikipedia.org/wiki/Primality_test#JavaScript
		isprime: (value) => {
			if(value <= 3) return +(value > 1);
			if(value % 2 === 0 || value % 3 === 0) return 0;

			let count = 5;

			while(count ** 2 <= value) {
				if(value % count === 0 || value % (count + 2) === 0) return 0;
				count += 6;
			}

			return 1;
		},

		// https://en.wikipedia.org/wiki/Euclidean_algorithm
		gcd: (num, den) => {
			if(!Number.isInteger(num) || !Number.isInteger(den)) return 0;

			while(num > 0) {
				const temp = num;
				num = den % num;
				den = temp;
			}

			return den;
		}
	},


	macros: {
		hex: (tokens) => {
			let tk_string = join_tokens(tokens);
			let res = Number(`${tk_string.startsWith('0x') ? '' : '0x'}${tk_string}`);
			if(isNaN(res)) return new Err(Err.Other, "Invalid Hex String");

			return [new Token(Token.Number, res, { negative: false })];
		},
		oct: (tokens) => {
			let tk_string = join_tokens(tokens);
			let res = Number(`${tk_string.startsWith('0o') ? '' : '0o'}${tk_string}`);
			if(isNaN(res)) return new Err(Err.Other, "Invalid Octal String");

			return [new Token(Token.Number, res, { negative: false })];
		},
		bin: (tokens) => {
			let tk_string = join_tokens(tokens);
			let res = Number(`${tk_string.startsWith('0b') ? '' : '0b'}${tk_string}`);
			if(isNaN(res)) return new Err(Err.Other, "Invalid Binary String");

			return [new Token(Token.Number, res, { negative: false })];
		},

		convert: (from, to) => {
			if(!from) return new Err(Err.Other, "Missing Parameters");
			else if(from.length > 3 && ['as', 'to', 'in'].includes(from[from.length - 2].data)) {
				to = from.slice(-1);
				from = from.slice(0, -2);
			}
			else if(!to) return new Err(Err.Other, "Missing Parameters");

			const from_val = Calculator.eval_tokens(from.slice(0, -1))[0].value; // TODO: Check for errors
			const from_type = from[from.length - 1].data;
			const to_type = to[0].data;

			if(!Converter.has_type(from_type) || !Converter.has_type(to_type))
				return new Err(Err.Other, "Unknown Unit");

			let result = Converter.convert(from_val, from_type, to_type);

			return [new Token(Token.Number, result, { negative: false })];
		},

		f: (var_name, equation, start, stop, step) => {
			var_name = parse(var_name[0], Token.Name);
			start = parse(start[0], Token.Number);
			stop = parse(stop[0], Token.Number);

			if(!step) step = 1;
			else step = parse(step[0], Token.Number);

			if(Math.abs(start - stop) / step > 100)
				return new Err(Err.Other, "Step size too small");

			if(start > stop && step > 0)
				step = -step;

			let calc_addons = { ...addons };
			let results = [];

			while(start <= stop) {
				calc_addons.constants[var_name] = start;
				let result = Calculator.eval_tokens(equation, calc_addons);

				for(let r in result) {
					if(result[r].error.has_error())
						return result[r].error;

					if(Array.isArray(result[r].value))
						results.push(new Token(Token.List, result[r].value, { negative: false }));
					else
						results.push(new Token(Token.Number, result[r].value, { negative: false }));
				}

				start += step;
			}

			return [new Token(Token.List, results, { negative: false })];
		}
	}
};


addons.functions.gcf = addons.functions.gcd;

for(let f in addons.functions) {
	addons.functions[f] = tk_wrap(addons.functions[f]);
}

export default addons;

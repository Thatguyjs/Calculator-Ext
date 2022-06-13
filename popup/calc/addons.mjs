// Copyright (c) 2022 Thatguyjs All Rights Reserved.
// Constants and functions for the calculator

import Converter from "./converter.mjs";
import Calculator, { Token, Err } from "../../Calc-JS/src/include.mjs";

// Only load the module for browsers
let Buttons = { get_angle_mode: () => { return "Rad"; } };

if(typeof document !== 'undefined')
	Buttons = (await import("../buttons.mjs")).default;


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

		const result = call(...nums);

		if(isNaN(result)) {
			const last_tk = tokens[tokens.length - 1];

			const location = {
				start: tokens[0]?.modifier?.start ?? null,
				end: last_tk?.modifier?.end ?? null
			};

			return new Err(Err.Other, "Invalid Value", location);
		}
		else return new Token(Token.Number, result);
	}
}

// Set the first parameter of a macro to the location spanning all args
function macro_wrap(call) {
	return function(...groups) {
		if(groups.length === 0)
			return call({ start: null, end: null }, ...groups);
		else {
			const last_grp = groups[groups.length - 1];

			return call({
				start: groups[0][0].modifier.start,
				end: last_grp[last_grp.length - 1].modifier.end
			}, ...groups);
		}
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

		trunc: (value, decimals) => {
			if(typeof value === 'undefined') return NaN;

			decimals ??= 0;
			return +value.toFixed(decimals);
		},

		max: (...args) => Math.max.apply(Math, args),
		min: (...args) => Math.min.apply(Math, args),

		sin: (value) => {
			if(Buttons.get_angle_mode() === 'Deg') value *= Math.PI / 180;
			return Math.sin(value);
		},
		asin: (value) => {
			const mult = Buttons.get_angle_mode() === 'Deg' ? 180 / Math.PI : 1;
			return Math.asin(value) * mult;
		},

		cos: (value) => {
			if(Buttons.get_angle_mode() === 'Deg') value *= Math.PI / 180;
			return Math.cos(value);
		},
		acos: (value) => {
			const mult = Buttons.get_angle_mode() === 'Deg' ? 180 / Math.PI : 1;
			return Math.acos(value) * mult;
		},

		tan: (value) => {
			if(Buttons.get_angle_mode() === 'Deg') value *= Math.PI / 180;
			return Math.tan(value);
		},
		atan: (value) => {
			const mult = Buttons.get_angle_mode() === 'Deg' ? 180 / Math.PI : 1;
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
		hex: (location, tokens) => {
			const tk_string = join_tokens(tokens);
			const res = Number(`${tk_string.startsWith('0x') ? '' : '0x'}${tk_string}`);

			if(isNaN(res))
				return new Err(Err.Other, "Invalid Hex Value", location);

			return [new Token(Token.Number, res, { negative: false })];
		},
		oct: (location, tokens) => {
			const tk_string = join_tokens(tokens);
			const res = Number(`${tk_string.startsWith('0o') ? '' : '0o'}${tk_string}`);

			if(isNaN(res))
				return new Err(Err.Other, "Invalid Octal Value", location);

			return [new Token(Token.Number, res, { negative: false })];
		},
		bin: (location, tokens) => {
			const tk_string = join_tokens(tokens);
			const res = Number(`${tk_string.startsWith('0b') ? '' : '0b'}${tk_string}`);

			if(isNaN(res))
				return new Err(Err.Other, "Invalid Binary Value", location);

			return [new Token(Token.Number, res, { negative: false })];
		},

		convert: (location, from, to) => {
			if(!from) return new Err(Err.Other, "Missing Parameters", location);
			else if(from.length > 3 && ['as', 'to', 'in'].includes(from[from.length - 2].data)) {
				to = from.slice(-1);
				from = from.slice(0, -2);
			}
			else if(!to) return new Err(Err.Other, "Missing Parameters", location);

			const from_val = Calculator.eval_tokens(from.slice(0, -1))[0].value; // TODO: Check for errors
			const from_type = from[from.length - 1].data;
			const to_type = to[0].data;

			if(!Converter.has_type(from_type))
				return new Err(Err.Other, "Unknown Unit", {
					start: from[from.length - 1].modifier.start,
					end: from[from.length - 1].modifier.end
				});

			if(!Converter.has_type(to_type))
				return new Err(Err.Other, "Unknown Unit", {
					start: to[to.length - 1].modifier.start,
					end: to[to.length - 1].modifier.end
				});

			return [new Token(
				Token.Number,
				Converter.convert(from_val, from_type, to_type),
				{ negative: false }
			)];
		},

		range: (location, start, stop, step) => {
			if(!start || !stop)
				return new Err(Err.Other, "Missing Parameters", location);

			let start_val = parse(start[0], Token.Number);
			let stop_val = parse(stop[0], Token.Number);
			let step_val = step ? parse(step[0], Token.Number) : 1;

			if(start_val === stop_val)
				return new Err(Err.Other, "Invalid Range Bounds", {
					start: location.start,
					end: step ? step[0].modifier.end : stop[0].modifier.end
				});

			let nums = [];

			if(start_val > stop_val) {
				while(start_val >= stop_val) {
					nums.push(new Token(Token.Number, start_val));
					start_val -= step_val;
				}
			}
			else {
				while(start_val <= stop_val) {
					nums.push(new Token(Token.Number, start_val));
					start_val += step_val;
				}
			}

			return [new Token(Token.List, nums, { negative: false })];
		},

		f: (location, var_name, equation, start, stop, step) => {
			if(!var_name || !start || !stop)
				return new Err(Err.Other, "Missing Parameters", location);

			var_name = parse(var_name[0], Token.Name);
			start = parse(start[0], Token.Number);
			stop = parse(stop[0], Token.Number);
			step = step ? parse(step[0], Token.Number) : 1;

			if(Math.abs(start - stop) / step > 100)
				return new Err(Err.Other, "Step size too small", location);

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

for(let f in addons.functions)
	addons.functions[f] = tk_wrap(addons.functions[f]);

for(let m in addons.macros)
	addons.macros[m] = macro_wrap(addons.macros[m]);

export default addons;

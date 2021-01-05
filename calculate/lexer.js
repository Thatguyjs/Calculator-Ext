const Lexer = {

	// Error constants
	error: {
		unexpected_char: 0,
		invalid_operation: 1,
		missing_parameters: 2,
		invalid_definition: 3,
	},


	// Operator type constants
	op: {
		prefix: 0,
		infix: 1,
		postfix: 2
	},


	// Token type constants
	token: {
		number: 0,
		operator: 1,
		function: 2,
		parenthesis: 3,
		expression: 4,
		list: 5,
		separator: 6,
		equals: 7,
		other: 8,
		none: 9
	},


	// Whitespace characters
	_whitespace: ' \t\r\n',


	// Number characters
	_numbers: '1234567890.',


	// Other possible characters
	_chars: 'abcdefghijklmnopqrstuvwxyz',


	// Operator list
	_operators: {},


	// Active string to generate tokens from
	_string: "",
	_index: 0,


	// Token list
	_tokens: [],


	// Initialize operators
	init: function() {
		this._operators = {
			'+': { order: 0, type: this.op.infix },
			'-': { order: 0, type: this.op.infix },
			'*': { order: 1, type: this.op.infix },
			'/': { order: 1, type: this.op.infix },
			'^': { order: 2, type: this.op.infix },
			'E': { order: 3, type: this.op.infix },
			'!': { order: 3, type: this.op.postfix }
		};
	},


	// Convert a list of tokens to a syntax tree
	_toTree: function(tokens, root=false) {
		if(!tokens.length) return { type: this.token.none };

		let opStack = new Stack();
		let numStack = new Stack();

		const length = tokens.length;
		let ind = 0;

		while(ind < length) {
			const token = tokens[ind];
			if(token.error) return token;

			// Number
			if(token.type === this.token.number) {
				numStack.push(token);
			}

			// Operator
			else if(token.type === this.token.operator) {
				while(opStack.length && token.op.order <= opStack.top.op.order) {
					if(numStack.length < 2) return { error: this.error.invalid_operation };

					let nums = [numStack.pop(), numStack.pop()];

					numStack.push({
						type: this.token.operator,
						value: opStack.pop().value,
						params: [nums[1], nums[0]]
					});
				}

				if(token.op.type === this.op.infix) {
					opStack.push(token);
				}
				else if(token.op.type === this.op.postfix) {
					if(!numStack.length) return { error: this.error.invalid_operation };

					numStack.push({
						type: this.token.operator,
						value: token.value,
						params: [numStack.pop(), { type: this.token.number, value: 0 }]
					});
				}
			}

			// Function
			else if(token.type === this.token.function) {
				if(!tokens[ind + 1] || tokens[ind + 1].type !== this.token.expression) {
					return { error: this.error.missing_parameters };
				}

				numStack.push({
					type: this.token.function,
					value: token.value,
					params: this._toTree(tokens[++ind].data, false)
				});
			}

			// Expression
			else if(token.type === this.token.expression) {
				numStack.push({
					type: this.token.expression,
					data: this._toTree(token.data, false)
				});
			}

			// Variable / constant
			else if(token.type === this.token.other) {
				numStack.push(token);
			}

			ind++;
		}

		while(opStack.length) {
			if(numStack.length < 2) return { error: this.error.invalid_operation };

			let nums = [numStack.pop(), numStack.pop()];

			numStack.push({
				type: this.token.operator,
				value: opStack.pop().value,
				params: [nums[1], nums[0]]
			});
		}

		if(numStack.length > 1) return {
			type: this.token.list,
			items: numStack.items
		};

		return numStack.top;
	},


	// Generate a group of tokens
	_toGroup: function(tokens, ind=0) {
		let expr = [];

		while(ind < tokens.length) {
			if(tokens[ind].type === this.token.parenthesis) {
				if(tokens[ind].value === '(') {
					const group = this._toGroup(tokens, ind + 1);

					expr.push({
						type: this.token.expression,
						data: group.expr
					});

					ind = group.ind + 1;
					continue;
				}
				else return { expr, ind };
			}

			expr.push(tokens[ind]);
			ind++;
		}

		return { expr, ind };
	},


	// Determine if a '-' operator acts as a negative sign
	_isNegative: function(last) {
		return (last.type === this.token.operator && last.op.type !== this.op.postfix)
			|| last.value === '(' || last.value === ',';
	},


	// Get the next token from a string
	next: function(last=null) {
		if(this._index >= this._string.length) return null;
		while(this._whitespace.includes(this._string[this._index])) this._index++;

		const char = this._string[this._index];

		// Number
		if(this._numbers.includes(char)) {
			let numString = char;

			while(this._numbers.includes(this._string[++this._index])) {
				numString += this._string[this._index];
			}

			return {
				type: this.token.number,
				value: +numString
			};
		}

		// Operator
		else if(this._operators[char]) {
			this._index++;

			// Negative numbers
			if(char === '-' && (!last || this._isNegative(last))) {
				let num = this.next();
				num.value = -num.value;

				return num;
			}

			return {
				type: this.token.operator,
				op: this._operators[char],
				value: char,
			};
		}

		// Function
		else if(this._string.slice(this._index).search(/[a-z]+\(/i) === 0) {
			const len = this._string.indexOf('(', this._index) - this._index;
			this._index += len;

			return {
				type: this.token.function,
				value: this._string.slice(this._index - len, this._index)
			};
		}

		// Other characters
		else if(this._chars.includes(char)) {
			let charString = char;

			while(this._chars.includes(this._string[++this._index])) {
				charString += this._string[this._index];
			}

			return {
				type: this.token.other,
				value: charString
			};
		}

		// Parentheses
		else if(char === '(' || char === ')') {
			this._index++;

			return {
				type: this.token.parenthesis,
				value: char
			};
		}

		// Comma
		else if(char === ',') {
			this._index++;

			return {
				type: this.token.separator,
				value: char
			};
		}

		// Equals sign
		else if(char === '=') {
			this._index++;

			return {
				type: this.token.equals,
				value: char
			};
		}

		this._index++;
		return null;
	},


	// Generate tokens from a string
	toTokens: function(string) {
		this._string = string;
		let tokens = [];
		let tk = this.next();

		while(tk !== null) {
			tokens.push(tk);
			tk = this.next(tk);
		}

		this._index = 0;
		return tokens;
	},


	// Get a list of expressions from tokens
	toExpressions: function(tokens) {
		let exprs = [];
		let current = [];

		let depth = 0;

		for(let t in tokens) {
			if(tokens[t].value === '(') depth++;
			else if(tokens[t].value === ')') depth--;

			else if(tokens[t].value === ',' && depth === 0) {
				exprs.push(current);
				current = [];
				continue;
			}

			current.push(tokens[t]);
		}

		if(current.length) exprs.push(current);
		return exprs;
	},


	// Generate ordered token groups from tokens
	toTree: function(tokens) {
		let grouped = this._toGroup(tokens, 0);
		let tree = this._toTree(grouped.expr, true);

		return tree;
	},


	// Check if an expression acts as a variable definition
	isDefinition: function(tokens) {
		return tokens.length > 2
				&& tokens[0].type === this.token.other
				&& tokens[1].type === this.token.equals;
	},


	// Get definition info from tokens
	getDefinition: function(tokens) {
		return {
			name: tokens[0].value,
			expr: this.toTree(tokens.slice(2))
		};
	},


	// Get the token list
	get tokens() {
		return this._tokens;
	}

};

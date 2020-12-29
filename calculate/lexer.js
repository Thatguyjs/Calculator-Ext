const Lexer = {

	// Error constants
	error: {
		unexpected_char: 0,
		invalid_operation: 1
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
		other: 5
	},


	// Whitespace characters
	_whitespace: ' \t\r\n',


	// Number characters
	_numbers: '1234567890.',


	// Other possible characters
	_chars: 'abcdefghijklmnopqrstuvwxyz',


	// Operator list
	_operators: {},


	// Function list
	_functions: {},
	_funcNames: [],


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


	// Group a list of tokens without parentheses
	_groupExpr: function(tokens) {
		let ops = tokens.filter(tk => tk.type === this.token.operator);

		let opStack = new Stack();
		let numStack = new Stack();

		const length = tokens.length;
		let ind = 0;

		while(ind < length) {
			const token = tokens[ind];

			// Number
			if(token.type === this.token.number) {
				numStack.push(token);
			}

			// Operator
			else if(token.type === this.token.operator) {
				while(opStack.length && token.op.order <= opStack.top.op.order) {
					if(numStack.length < 2) {
						return { error: this.error.invalid_operation };
					}

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
					numStack.push({
						type: this.token.operator,
						value: token.value,
						params: [numStack.pop()]
					});
				}
			}

			// Function
			else if(token.type === this.token.function) {
				numStack.push({
					type: this.token.function,
					value: token.value,
					params: [tokens[++ind] || null]
				});
			}

			// Expression
			else if(token.type === this.token.expression) {
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

		return numStack.top;
	},


	// Determine if a token acts as a value in an expression
	_isValue: function(token) {
		return token
			&& token.type !== this.token.operator
			&& token.value !== '(';
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
			if(char === '-' && (!last || !this._isValue(last))) {
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


	// Generate token groups from tokens
	group: function(tokens) {
		let exprs = [[]];
		let depth = 0;
		let index = 0;

		while(index < tokens.length) {
			if(tokens[index].value === '(') {
				exprs[depth].push({ type: this.token.expression });
				depth++;
				exprs[depth] = [];

				index++;
				continue;
			}
			else if(tokens[index].value === ')') {
				depth--;
				index++;
				continue;
			}

			exprs[depth].push(tokens[index]);
			index++;
		}

		let groups = [];

		for(let e in exprs) {
			groups.push(this._groupExpr(exprs[e]));
		}

		return groups;
	},


	// Get the token list
	get tokens() {
		return this._tokens;
	}

};

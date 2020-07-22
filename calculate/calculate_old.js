// Copyright (c) 2020 Thatguyjs All Rights Reserved.


const Calculator = {

	// Added functions and constants
	_added: [],


	// All tokens
	_tokenTypes: [
		['!', 'postfix'],
		['+-*/%^E', 'operator'],
		['0123456789.', 'number'],
		['()', 'paren']
	],


	// The operator order
	_tokenOrder: {
		'+': 0, '-': 0,
		'*': 1, '/': 1, '%': 1,
		'^': 2,
		'E': 3
	},


	// The list of tokens, the tree, and current index
	_tokens: [],
	_tree: {},
	_index: 0,


	// The result and error code
	_result: null,
	_error: 0,


	// Generate a list of tokens
	_genTokens: function(expression, stop=null) {
		expression = expression.replace(/\s+/g, '');

		let tokens = [];
		let lastExpr = false;

		let length = expression.length;
		let index = 0;

		while(!this._error && index < length && expression[index] !== stop) {
			let found = false;

			for(let t in this._tokenTypes) {
				if(this._tokenTypes[t][0].includes(expression[index])) {
					found = true;

					// Postfixes
					if(this._tokenTypes[t][1] === 'postfix') {
						if(!lastExpr) return this._error = 1;

						tokens.push({
							type: 'postfix',
							value: expression[index]
						});

						lastExpr = true;
						index++;
					}

					// Operators
					else if(this._tokenTypes[t][1] === 'operator') {
						if(!lastExpr) {
							tokens.push({
								type: 'negative',
								value: '-'
							});
						}
						else {
							tokens.push({
								type: 'operator',
								value: expression[index],
								order: this._tokenOrder[expression[index]]
							});

							lastExpr = false;
						}

						index++;
					}

					// Numbers
					else if(this._tokenTypes[t][1] === 'number') {
						let numString = "";

						while(this._tokenTypes[t][0].includes(expression[index])) {
							numString += expression[index++];
						}

						if(tokens.length && tokens[tokens.length - 1].type === 'negative') {
							tokens[tokens.length - 1] = {
								type: 'number',
								value: -Number(numString)
							};
						}
						else {
							tokens.push({
								type: 'number',
								value: Number(numString)
							});
						}

						lastExpr = true;
					}

					// Parenthesis
					else {
						tokens.push({
							type: 'paren',
							value: expression[index]
						});

						lastExpr = (expression[index] === ')');
						index++;
					}

					break;
				}
			}

			if(found) continue;

			// Search through added functions / constants
			for(let a in this._added) {
				if(expression.substr(index, this._added[a][1].length) === this._added[a][1]) {
					found = true;

					lastExpr = true;
					index += this._added[a][1].length;

					if(this._added[a][0] === 'constant') {
						if(tokens.length && tokens[tokens.length - 1].type === 'negative') {
							tokens[tokens.length - 1] = {
								type: 'number',
								value: -this._added[a][2]
							};
						}
						else {
							tokens.push({
								type: 'number',
								value: this._added[a][2]
							});
						}
					}
					else {
						tokens.push({ type: 'function', callback: this._added[a][2] });
					}

					break;
				}
			}

			// Unknown character
			if(!found) {
				console.log("Unknown character:", expression[index]);
				this._error = 2;
				break;
			}
		}

		return tokens;
	},


	// Perform an operation
	_operate: function(n1, op, n2) {
		switch(op) {

			// Postfixes

			case '!':
				if(n1 < 0 || Math.trunc(n1) !== n1) {
					this._error = 5;
					return n1;
				}

				n2 = n1;
				while(--n2 > 1) n1 *= n2;
				return n1;

			// Operations

			case '+':
			return n1 + n2;

			case '-':
			return n1 - n2;

			case '*':
			return n1 * n2;

			case '/':
			return n1 / n2;

			case '%':
			return n1 % n2;

			case '^':
			return n1 ** n2;

			case 'E':
			return n1 * (10 ** n2);

		}
	},


	// Construct a tree of tokens
	_walk: function() {
		if(this._error) return this._error;

		let token = this._tokens[this._index];
		let peek = this._tokens[this._index + 1];


		// Postfixes
		if(peek && peek.type === 'postfix') {
			this._tokens[++this._index] = {
				type: 'postfix',
				value: peek.value,
				expression: token
			};

			return this._walk();
		}

		// Operators
		else if(peek && peek.type === 'operator') {
			let future = this._tokens[this._index + 3];

			if(future && future.type === 'operator' && future.order < peek.order) {
				let first = {
					type: peek.type,
					operator: peek.value,
					params: [token, this._tokens[this._index + 2]]
				};

				let second = {
					type: future.type,
					operator: future.value,
					params: [first]
				};

				this._index += 4;
				second.params.push(this._walk());

				return second;
			}

			let node = {
				type: peek.type,
				operator: peek.value,
				params: [token]
			};

			this._index += 2;
			node.params.push(this._walk());

			return node;
		}

		// Opening parenthesis
		else if(token.type === 'paren') {
			this._index++;
			let result = this._walk();

			// Check for closing parenthesis
			if(this._tokens[this._index] && this._tokens[this._index].value !== ')') {
				console.log('Missing paren');
				return this._error = 3;
			}

			// Set the closing parenthesis to the current expression
			this._tokens[this._index] = result;
			return this._walk();
		}

		// Functions
		else if(token.type === 'function') {
			if((this._index + 1) >= this._tokens.length) {
				return this._tokens[this._index];
			}

			if(this._tokens[++this._index].type !== 'paren') {
				console.log("Invalid function call");
				return this._error = 4;
			}

			this._index++;
			let pastInd = this._index;

			this._tokens[this._index] = {
				type: 'function',
				params: this._walk(),
				callback: token.callback
			};

			this._tokens[this._index] = this._tokens[pastInd];
			return this._walk();
		}

		// Negatives
		else if(token.type === 'negative') {
			this._index++;

			return {
				type: 'negative',
				expression: this._walk()
			};
		}

		// Numbers
		else {
			this._index++;
			return token;
		}
	},


	// Evaluate a simple expression from a node
	_parseNode: function(node) {
		switch(node.type) {

			case 'postfix':
			return this._operate(
				this._parseNode(node.expression),
				node.value
			);

			case 'operator':
			return this._operate(
				this._parseNode(node.params[0]),
				node.operator,
				this._parseNode(node.params[1])
			);

			case 'paren':
			return this._parseNode(node.expression);

			case 'function':
			return node.callback(this._parseNode(node.params));

			case 'negative':
			return -this._parseNode(node.expression);

			case 'number':
			return node.value;

		}
	},


	// Evaluate an expression
	eval: function(expression) {
		if(!expression || typeof expression !== 'string') this._error = 1;

		// Reset
		this._result = null;
		this._error = 0;

		this._tokens = [];
		this._tree = {};
		this._index = 0;

		// Setup
		this._tokens = this._genTokens(expression);
		this._tree = this._walk();

		// Parse
		this._result = this._parseNode(this._tree);

		return {
			error: this._error,
			value: this._result
		};
	},


	// Add custom functions to the calculator
	addFunction: function(name, callback) {
		this._added.push(['function', name, callback]);
	},


	// Remove all functions
	removeFunctions: function() {
		this._added = this._added.filter(item => item[0] !== 'function');
	},


	// Add custom constants to the calculator
	addConstant: function(name, value) {
		this._added.push(['constant', name, value]);
	},


	// Remove all constants
	removeConstants: function() {
		this._added = this._added.filter(item => item[0] !== 'constant');
	},


	// Get the error message from a code
	getError: function(code) {
		return [
			"Unexpected Input",
			"Unknown Character",
			"Missing Closing Parenthesis",
			"Invalid Function Call",
			"Invalid Expression"
		][code - 1];
	}

};

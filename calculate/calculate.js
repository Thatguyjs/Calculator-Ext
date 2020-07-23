const Calculator = {


	// Added functions and constants
	_added: {
		functions: [],
		constants: []
	},


	// Parse error
	_error: 0,


	// Error code messages
	_errorMessages: [
		null,
		"Unexpected input",
		"Invalid operation",
		"Invalid node"
	],


	// Reset calculator variables
	_reset: function() {
		this._error = 0;
	},


	// Check if a character is a number
	_isNumber: function(char) {
		return '0123456789.'.includes(char);
	},


	// Check if a character is a postfix operator
	_isPostfix: function(char) {
		return '!'.includes(char);
	},


	// Check if a character is an operator
	_isOperator: function(char) {
		return '+-*/%^E'.includes(char);
	},


	// Check if a string is an added function
	_isFunction: function(string, start) {
		let part = string.slice(start);

		if(part.indexOf('(') === -1) {
			return false;
		}

		part = part.slice(0, part.indexOf('('));
		return this._added.functions[part] !== undefined ? part.length : false;
	},


	// Check if a string is an added constant
	_isConstant: function(string, start) {
		let part = "";
		let ind = start;

		while(ind < string.length && !this._isOperator(string[ind])) {
			part += string[ind++];
		}

		return this._added.constants[part] !== undefined ? part.length : false;
	},


	// Get the precedence of an operator
	_getPrecedence: function(op) {
		return {
			'+': 1, '-': 1,
			'*': 2, '/': 2, '%': 2,
			'^': 3,
			'!': 4,
			'E': 5
		}[op];
	},


	// Convert infix to prefix & construct an AST
	_toPrefix: function(expr=null) {
		if(this._error || !expr) return { type: 'none' };

		let opStack = new Stack();
		let numStack = new Stack();

		let lastExpr = false;

		const length = expr.length;
		let ind = 0;

		while(!this._error && ind < length) {

			// Negatives
			if(expr[ind] === '-' && !lastExpr) {
				numStack.push({ type: 'number', value: 0 });
				opStack.push('-');

				lastExpr = true;
			}

			// Numbers
			else if(this._isNumber(expr[ind])) {
				let numString = "";
				while(this._isNumber(expr[ind])) numString += expr[ind++];
				ind--;

				numStack.push({
					type: 'number',
					value: Number(numString)
				});

				lastExpr = true;
			}

			// Postfix operators
			else if(this._isPostfix(expr[ind])) {
				if(!numStack.length) {
					this._error = 2;
					break;
				}

				while(opStack.length && this._getPrecedence(expr[ind]) <= this._getPrecedence(opStack.top)) {
					if(numStack.length < 2) {
						this._error = 2;
						break;
					}

					let values = [numStack.pop(), numStack.pop()];

					numStack.push({
						type: 'operator',
						value: opStack.pop(),
						params: values.reverse()
					});
				}

				numStack.push({
					type: 'postfix',
					value: expr[ind],
					params: numStack.pop()
				});

				lastExpr = true;
			}

			// Operators
			else if(this._isOperator(expr[ind])) {
				if(!numStack.length) {
					this._error = 2;
					break;
				}

				while(opStack.length && this._getPrecedence(expr[ind]) <= this._getPrecedence(opStack.top)) {
					if(numStack.length < 2) {
						this._error = 2;
						break;
					}

					let values = [numStack.pop(), numStack.pop()];

					numStack.push({
						type: 'operator',
						value: opStack.pop(),
						params: values.reverse()
					});
				}

				opStack.push(expr[ind]);
				lastExpr = false;
			}

			// Parentheses
			else if(expr[ind] === '(') {
				opStack.push('(');
				lastExpr = false;
			}

			else if(expr[ind] === ')') {
				while(opStack.length && opStack.top !== '(') {
					if(numStack.length < 2) {
						this._error = 2;
						break;
					}

					let values = [numStack.pop(), numStack.pop()];

					numStack.push({
						type: 'operator',
						value: opStack.pop(),
						params: values.reverse()
					});
				}

				opStack.pop();
				lastExpr = true;
			}

			// Added functions
			else if(this._isFunction(expr, ind)) {
				let nameLength = this._isFunction(expr, ind);
				let name = expr.substr(ind, nameLength);

				ind += nameLength;
				let paramString = "";
				let depth = 0;

				while(expr[++ind] !== ')' || depth) {
					if(expr[ind] === '(') depth++;
					else if(expr[ind] === ')') depth--;

					paramString += expr[ind];
				}

				numStack.push({
					type: 'function',
					params: this._toPrefix(paramString),
					call: this._added.functions[name]
				});

				ind += paramString.length - 1;
				lastExpr = true;
			}

			// Added constants
			else if(this._isConstant(expr, ind)) {
				let nameLength = this._isConstant(expr, ind);
				let name = expr.substr(ind, nameLength);

				numStack.push({
					type: 'number',
					value: this._added.constants[name]
				});

				ind += nameLength - 1;
				lastExpr = true;
			}

			// Unexpected character
			else {
				this._error = 1;
				console.log(`Unexpected character: "${expr[ind]}" at index`, ind);
				break;
			}

			ind++;
		}

		while(opStack.length) {
			let values = [numStack.pop(), numStack.pop()];

			numStack.push({
				type: 'operator',
				value: opStack.pop(),
				params: values.reverse()
			});
		}

		return numStack.top;
	},


	// Perform an operation
	_operate: function(n1, op, n2) {
		switch(op) {

			// Postfix operators

			case '!':
				if(n1 < 0) {
					this._error = 2;
					return 0;
				}

				n2 = n1;
				while(--n2) n1 *= n2;
			return n1;


			// Normal operators

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

			default:
				this._error = 2;
				return 0;

		}
	},


	// Parse part of an AST
	_parseNode: function(node) {
		if(!node && !this._error) this._error = 3;
		if(this._error) return null;

		switch(node.type) {

			case 'number':
			return node.value;

			case 'negative':
			return -this._parseNode(node.value);

			case 'postfix':
			return this._operate(
				this._parseNode(node.params),
				node.value,
				null
			);

			case 'operator':
			return this._operate(
				this._parseNode(node.params[0]),
				node.value,
				this._parseNode(node.params[1])
			);

			case 'function':
			if(node.params.type === 'none') return node.call();
			return node.call(this._parseNode(node.params));

			case 'none':
			return null;

			default:
				this._error = 3;
				return 0;

		}
	},


	// Add a constant
	addConstant: function(name, value) {
		this._added.constants[name] = value;
	},


	// Add a function
	addFunction: function(name, callback) {
		this._added.functions[name] = callback;
	},


	// Evaluate a mathematical expression
	eval: function(expr=null) {
		if(!expr) return { error: 0, value: "" };
		this._reset();

		// Remove whitespace
		expr = expr.replace(/\s+/g, '');

		// Parse the expression
		let prefixed = this._toPrefix(expr);
		let result = this._parseNode(prefixed);

		// Return the result
		return {
			error: this._error,
			value: result
		};
	},


	// Get an error message from a code
	getError: function(code) {
		return this._errorMessages[code];
	}

};

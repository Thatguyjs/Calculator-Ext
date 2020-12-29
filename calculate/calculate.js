const Calculator = {

	// Error codes (start at 50 to make room for Lexer error codes)
	error: {
		missing_expression: 50
	},


	// Function list
	_functions: {},


	// Perform a single operation
	_operate: function(op, n1, n2) {
		switch(op) {
			case '+': return n1 + n2;
			case '-': return n1 - n2;
			case '*': return n1 * n2;
			case '/': return n1 / n2;
			case '^': return n1 ** n2;
			// Todo: E

			case '!':
				if(n1 < 0) return { error: Lexer.error.invalid_operation };

				n2 = n1;
				while(--n2) n1 *= n2;
				return n1;

			default: return null;
		}
	},


	// Parse a node recursively
	_parseNode: function(node, lastVal) {
		if(!node) return null;

		switch(node.type) {

			case Lexer.token.number:
				return node.value;

			case Lexer.token.operator:
				return this._operate(
					node.value,
					this._parseNode(node.params[0], lastVal),
					this._parseNode(node.params[1], lastVal)
				);

			case Lexer.token.function:
				if(!this._functions[node.value]) return null;
				return this._functions[node.value](this._parseNode(node.params[0], lastVal));

			case Lexer.token.expression:
				return lastVal;

			case Lexer.token.other:
				return null; // Todo

		}
	},


	// Evaluate grouped nodes
	evalGroups: function(groups) {
		let result = null;
		let last = null;
		let error = 0;

		for(let g = groups.length - 1; g >= 0; g--) {
			if(groups[g].error) {
				error = groups[g].error;
				break;
			}

			last = result;
			result = this._parseNode(groups[g], last);
		}

		return {
			error,
			value: result
		};
	},


	// Evaluate from a list of tokens
	evalTokens: function(tokens) {
		const groups = Lexer.group(tokens);

		return this.evalGroups(groups);
	},


	// Evaluate from a string
	eval: function(string="") {
		if(!string.length) return { error: 1 };

		const tokens = Lexer.toTokens(string);
		const groups = Lexer.group(tokens);

		return this.evalGroups(groups);
	},


	// Add a constant to the calculator
	addConstant: function(name, value) {
		// Todo
	},


	// Add a function to the calculator
	addFunction: function(name, call) {
		this._functions[name] = call;
	},


	// Get the error message from an error code
	errorMessage: function(code) {
		switch(code) {
			case 0: return "None";
			case Lexer.error.unexpected_char: return "Unexpected character";
			case Lexer.error.invalid_operation: return "Invalid Operation";
			case this.error.missing_expression: return "Missing Expression";
		}
	}

};

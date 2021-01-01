const Calculator = {

	// Error codes (start at 50 to make room for Lexer error codes)
	error: {
		missing_expression: 50
	},


	// Functions, constants, and variables
	_functions: {},
	_constants: {},
	_variables: {},


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
				while(--n2 > 0) n1 *= n2;
				return n1;

			default: return null;
		}
	},


	// Parse a node recursively
	_parseNode: function(node) {
		if(!node) return null;

		switch(node.type) {

			case Lexer.token.number:
				return node.value;

			case Lexer.token.operator:
				return this._operate(
					node.value,
					this._parseNode(node.params[0]),
					this._parseNode(node.params[1])
				);

			case Lexer.token.function:
				if(!this._functions[node.value]) return null;
				return this._functions[node.value](this._parseNode(node.params));

			case Lexer.token.expression:
				return this._parseNode(node.data);

			case Lexer.token.other:
				if(this._constants[node.value]) return this._constants[node.value];
				return this._variables[node.value] || null;

			case Lexer.token.none:
				return;

		}
	},


	// Evaluate grouped nodes
	evalTree: function(tree) {
		let result = this._parseNode(tree);
		let error = 0;

		return {
			error,
			value: result
		};
	},


	// Evaluate from a list of tokens
	evalTokens: function(tokens) {
		const groups = Lexer.toTree(tokens);

		return this.evalTree(groups);
	},


	// Evaluate from a string
	eval: function(string="") {
		if(!string.length) return { error: 1 };

		const tokens = Lexer.toTokens(string);
		const groups = Lexer.toTree(tokens);

		return this.evalTree(groups);
	},


	// Add a constant to the calculator
	addConstant: function(name, value) {
		this._constants[name] = value;
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

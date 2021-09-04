// A minimal testing library

let results = [];


function fail(func_name, expected, actual) {
	results.push({
		success: false,
		func: func_name,
		expected,
		actual
	});
}

function success(func_name, expected, actual) {
	results.push({
		success: true,
		func: func_name,
		expected,
		actual
	});
}


function expect_eq(expected, actual, compare_func=null) {
	try {
		if(compare_func !== null) {
			if(!compare_func(expected, actual)) fail('expect_eq', expected, actual);
			else success('expect_eq', expected, actual);
		}
		else {
			if(expected !== actual) fail('expect_eq', expected, actual);
			else success('expect_eq', expected, actual);
		}
	}
	catch(err) {
		fail('expect_eq', expected, err);
	}
}


function finish() {
	let failed = [];

	for(let r in results) {
		if(!results[r].success) failed.push(results[r]);
	}

	console.log(`${results.length - failed.length} of ${results.length} tests passed.`);

	for(let f in failed) {
		console.log(`Failed test (${failed[f].func}): expected "${failed[f].expected}", got "${failed[f].actual}"`);
	}
}


module.exports = {
	fail,
	success,
	expect_eq,
	finish
};

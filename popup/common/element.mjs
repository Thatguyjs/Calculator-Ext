export const el = document.querySelector.bind(document);
export const els = document.querySelectorAll.bind(document);

export const els_arr = (selector) => {
	return Array.from(els(selector));
}

export const el_list = (...selectors) => {
	let result = [];

	for(let s in selectors)
		result.push(el(selectors[s]));

	return result;
}

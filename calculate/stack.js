// Copyright (c) 2020 Thatguyjs All Rights Reserved.


class Stack {
	constructor() {
		this._items = [];
		this._length = 0;
	}

	get(index=-1) {
		if(index < 0 || index >= this._length) return undefined;

		return this._items[index];
	}

	set(index, value) {
		if(index < 0 || index >= this._length) return undefined;

		this._items[index] = value;
		return value;
	}

	get top() {
		if(!this._length) return undefined;

		return this._items[this._length - 1];
	}

	set top(value) {
		if(this._length) {
			this._items[this._length - 1] = value;
		}
		else {
			this._items.push(value);
			this._length++;
		}

		return value;
	}

	push(...values) {
		this._length += values.length;
		return this._items.push.apply(this._items, values);
	}

	pop() {
		this._length = Math.max(this._length - 1, 0);
		return this._items.pop();
	}

	get items() {
		return this._items;
	}

	get length() {
		return this._length;
	}

	set length(length=0) {
		length = Math.max(length, 0);

		while(this._length > length) {
			this._items.pop();
			this._length--;
		}

		return this._length;
	}
}

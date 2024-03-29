// Copyright (c) 2021 Thatguyjs All Rights Reserved.
// A simple unit conversion utility


const Converter = {
	Unknown: -1,
	length: {
		Millimeter: { id: 0, type: 'length' },
		Centimeter: { id: 1, type: 'length' },
		Decimeter: { id: 2, type: 'length' },
		Foot: { id: 3, type: 'length' },
		Yard: { id: 4, type: 'length' },
		Meter: { id: 5, type: 'length' },
		Kilometer: { id: 6, type: 'length' },
		Mile: { id: 7, type: 'length' }
	},
	area: {
		SquareInch: { id: 0, type: 'area' },
		SquareFoot: { id: 1, type: 'area' },
		SquareYard: { id: 2, type: 'area' },
		SquareMeter: { id: 3, type: 'area' },
		Are: { id: 4, type: 'area' },
		Acre: { id: 5, type: 'area' },
		Hectare: { id: 6, type: 'area' },
	},
	mass: {
		Milligram: { id: 0, type: 'mass' },
		Grain: { id: 1, type: 'mass' },
		Gram: { id: 2, type: 'mass' },
		Dram: { id: 3, type: 'mass' },
		Ounce: { id: 4, type: 'mass' },
		Pound: { id: 5, type: 'mass' },
		Kilogram: { id: 6, type: 'mass' },
		Stone: { id: 7, type: 'mass' },
		Tonne: { id: 8, type: 'mass' },
		Ton: { id: 9, type: 'mass' }
	},
	angle: {
		Radian: { id: 0, type: 'angle' },
		Degree: { id: 1, type: 'angle' }
	},
	time: {
		Microsecond: { id: 0, type: 'time' },
		Millisecond: { id: 1, type: 'time' },
		Second: { id: 2, type: 'time' },
		Minute: { id: 3, type: 'time' },
		Hour: { id: 4, type: 'time' },
		Day: { id: 5, type: 'time' },
		Week: { id: 6, type: 'time' },
		Year: { id: 7, type: 'time' },
		Decade: { id: 8, type: 'time' },
		Century: { id: 9, type: 'time' }
	},


	// Get the numeric type from a string
	type(type) {
		switch(type.toLowerCase()) {
			case 'millimeter':
			case 'millimeters':
			case 'mm':
				return Converter.length.Millimeter;
			case 'centimeter':
			case 'centimeters':
			case 'cm':
				return Converter.length.Centimeter;
			case 'decimeter':
			case 'decimeters':
			case 'dm':
				return Converter.length.Decimeter;
			case 'foot':
			case 'feet':
			case 'ft':
				return Converter.length.Foot;
			case 'yard':
			case 'yards':
			case 'yd':
				return Converter.length.Yard;
			case 'meter':
			case 'meters':
			case 'm':
				return Converter.length.Meter;
			case 'kilometer':
			case 'kilometers':
			case 'km':
				return Converter.length.Kilometer;
			case 'mile':
			case 'miles':
			case 'mi':
				return Converter.length.Mile;

			case 'square inch':
			case 'square inches':
			case 'sq in':
				return Converter.area.SquareInch;
			case 'square foot':
			case 'square feet':
			case 'sq ft':
				return Converter.area.SquareFoot;
			case 'square yard':
			case 'square yards':
			case 'sq yd':
				return Converter.area.SquareYard;
			case 'square meter':
			case 'square meters':
			case 'sq m':
				return Converter.area.SquareMeter;
			case 'are':
			case 'ares':
				return Converter.area.Are;
			case 'acre':
			case 'acres':
			case 'ac':
				return Converter.area.Acre;
			case 'hectare':
			case 'hectares':
			case 'ha':
				return Converter.area.Hectare;

			case 'milligram':
			case 'milligrams':
			case 'mg':
				return Converter.mass.Milligram;
			case 'gram':
			case 'grams':
			case 'g':
				return Converter.mass.Gram;
			case 'dram':
			case 'drams':
			case 'dr':
				return Converter.mass.Dram;
			case 'grain':
			case 'grains':
			case 'gn':
				return Converter.mass.Grain;
			case 'ounce':
			case 'ounces':
			case 'oz':
				return Converter.mass.Ounce;
			case 'pound':
			case 'pounds':
			case 'lb':
			case 'lbs':
				return Converter.mass.Pound;
			case 'stone':
			case 'stones':
			case 'st':
				return Converter.mass.Stone;
			case 'kilogram':
			case 'kilograms':
			case 'kg':
			case 'kgs':
				return Converter.mass.Kilogram;
			case 'ton':
			case 'tons':
			case 't':
				return Converter.mass.Ton;
			case 'tonne':
			case 'tonnes':
			case 'mt':
				return Converter.mass.Tonne;

			case 'radian':
			case 'radians':
			case 'rad':
				return Converter.angle.Radian;
			case 'degree':
			case 'degrees':
			case 'deg':
				return Converter.angle.Degree;

			case 'microsecond':
			case 'microseconds':
			case 'us':
			case 'µs':
				return Converter.time.Microsecond;
			case 'millisecond':
			case 'milliseconds':
			case 'ms':
				return Converter.time.Millisecond;
			case 'second':
			case 'seconds':
			case 'sec':
			case 'secs':
				return Converter.time.Second;
			case 'minute':
			case 'minutes':
			case 'min':
			case 'mins':
				return Converter.time.Minute;
			case 'hour':
			case 'hours':
			case 'hr':
			case 'hrs':
				return Converter.time.Hour;
			case 'day':
			case 'days':
				return Converter.time.Day;
			case 'week':
			case 'weeks':
			case 'wk':
			case 'wks':
				return Converter.time.Week;
			case 'year':
			case 'years':
			case 'yr':
			case 'yrs':
				return Converter.time.Year;
			case 'decade':
			case 'decades':
			case 'dec':
				return Converter.time.Decade;
			case 'century':
			case 'centuries':
			case 'c':
				return Converter.time.Century;

			default:
				return Converter.Unknown;
		}
	},


	has_type(type) {
		return Converter.type(type) !== Converter.Unknown;
	},


	convert_length(value, from, to) {
		if(from.type !== 'length' || to.type !== 'length') return null;
		if(from.id === to.id) return value;

		// Central conversion: meter
		const rates = [
			1000,      // mm
			100,       // cm
			10,        // dm
			3.2808399, // ft
			1.0936133, // yd
			1,         // m
			0.001,     // km
			0.00062137 // mi
		];

		value = value / rates[from.id];
		return value * rates[to.id];
	},


	convert_area(value, from, to) {
		if(from.type !== 'area' || to.type !== 'area') return null;
		if(from.id === to.id) return value;

		// Central conversion: Are
		const rates = [
			155000.31,  // sq. in
			1076.39104, // sq. ft
			119.599005, // sq. yd
			100,        // sq. m
			1,          // are
			0.02471054, // acre
			0.01        // hectare
		];

		value = value / rates[from.id];
		return value * rates[to.id];
	},


	convert_mass(value, from, to) {
		if(from.type !== 'mass' || to.type !== 'mass') return null;
		if(from.id === to.id) return value;

		// Central conversion: Ounce
		const rates = [
			28349.5231, // mg
			437.5,      // grain
			28.3495231, // g
			16,         // dram
			1,          // oz
			0.0625,     // lb
			0.02834952, // kg
			0.00446429, // stone
			0.00002835, // tonne (metric)
			0.0000279   // ton (imperial)
		];

		value = value / rates[from.id];
		return value * rates[to.id];
	},


	convert_angle(value, from, to) {
		if(from.type !== 'angle' || to.type !== 'angle') return null;
		if(from.id === to.id) return value;

		// Central conversion: Radians
		const rates = [
			1,            // rad
			180 / Math.PI // deg
		];

		value = value / rates[from.id];
		return value * rates[to.id];
	},


	convert_time(value, from, to) {
		if(from.type !== 'time' || to.type !== 'time') return null;
		if(from.id === to.id) return value;

		// Central conversion: Day
		const rates = [
			8.6400e+10, // microsecond
			86400000,   // millisecond
			86400,      // second
			1440,       // minute
			24,         // hour
			1,          // day
			0.14285714, // week
			0.00273973, // year
			0.00027397, // decade
			0.00002739  // century
		];

		value = value / rates[from.id];
		return value * rates[to.id];
	},


	// Automatically detect types and choose the right function
	convert(value, from, to) {
		if(typeof from === 'string') from = Converter.type(from.trim());
		if(typeof to === 'string') to = Converter.type(to.trim());

		switch(from.type) {
			case 'length':
				return Converter.convert_length(value, from, to);
			case 'area':
				return Converter.convert_area(value, from, to);
			case 'mass':
				return Converter.convert_mass(value, from, to);
			case 'angle':
				return Converter.convert_angle(value, from, to);
			case 'time':
				return Converter.convert_time(value, from, to);

			default:
				return null;
		}
	}
};


export default Converter;

# Calculator-Ext
A calculator extension for Chrome


# Features

## Operators
| Operator | Name                |
|----------|---------------------|
|    \+    | Add                 |
|    \-    | Subtract            |
|    \*    | Multiply            |
|    /     | Divide              |
|    %     | Modulus             |
|    ^     | Exponent            |
|    !     | Factorial           |
|    E     | Scientific Notation |

## Constants
| Constant | Value        |
|----------|--------------|
|    pi    | 3.1415926536 |
|    e     | 2.7182818285 |

## Functions

#### abs(x)
Absolute value of `x`
#### rand([max])
#### rand([min, max])
Generate a random number, `min` and `max` are optional. If only `max` is given, `min` is assumed to be `0`
#### sum(...nums)
Sum multiple numbers
#### sumrange(start, stop)
Sum a range of numbers, inclusive
#### sqrt(x)
Square root of `x`
#### cbrt(x)
Cube root of `x`
#### floor(x)
Round `x` down to the nearest integer
#### round(x)
Round `x` to the nearest integer (`.5` is rounded up)
#### ceil(x)
Round `x` up to the nearest integer
#### sin(x) / asin(x)
Sine and Arcsine (also written as <code>sin<sup>-1</sup>(x)</code>)
#### cos(x) / acos(x)
Cosine and Arccosine (also written as <code>cos<sup>-1</sup>(x)</code>)
#### tan(x) / atan(x)
Tangent and Arctangent (also written as <code>tan<sup>-1</sup>(x)</code>)
#### log(x)
Logarithm base 10 of `x`
#### ln(x)
Logarithm base `e` of `x`
#### isprime(x)
Returns `1` if `x` is prime, and `0` if `x` is not prime
#### gcd(num, den)
#### gcf(num, den)
Returns the greatest common denominator (factor) of two numbers. Returns `0` if either number is not an integer

## Macros

#### hex(value)
Convert `value` from hexadecimal (base 16) to decimal (base 10)
#### oct(value)
Convert `value` from octal (base 8) to decimal (base 10)
#### bin(value)
Convert `value` from binary (base 2) to decimal (base 10)
#### convert(value from_unit, to_unit)
#### convert(value from_unit ["as" | "to" | "in"] to_unit)
Converts `value` from `from_unit` to `to_unit`
#### range(start, stop[, step])
Creates a list that spans from `start` to `stop`, with an optional `step` size (default: `1`)
#### f(variable, equation, start, stop[, step])
Compute `equation` for each value of `variable` as defined by the range [`start`, `stop`] with an optional `step` size (default: `1`)

### Expressions
 - Multiple expressions can be separated by using commas (,) in the input field.
   - Ex: `1 + 2, 3 - 5` = `3, -2`
 - Each expression is evaluated separately, and displayed in their respective order after being evaluated. Definition expressions (Ex. `x = 4`) are not displayed as output.

### Variables
 - Supports arbitrary variable names (all lowercase, must not collide with constants or operators)
 - A variable definition is an expression that starts with a variable name, an equals sign, followed by an evaluable expression (Ex. `x = 4`, or `myvar = 5 + 6`)
 - Variables can be defined before or after an expression (Ex. `x = 2, 3x` and `3x, x = 2` are both valid)
 - Variables definitions that rely on each other must be defined in order (Ex. `x = 2, y = 5 - x` is valid, but `y = 5 - x, x = 2` is not valid)

### Other
 - Supports both degree (Deg) and radian (Rad) modes
 - Keeps track of the last 25 calculations and results

# Calculator-Ext
A calculator extension for Chrome

## Supported Features

### Operators
| Operator | Name                  |
|----------|-----------------------|
|    \+    |  Add                  |
|    \-    |  Subtract             |
|    \*    |  Multiply             |
|    /     |  Divide               |
|    %     |  Modulus              |
|    ^     |  Exponent             |
|    !     |  Factorial            |
|    E     |  Scientific Notation  |

### Constants
| Constant | Value        |
|----------|--------------|
|    pi    | 3.1415926536 |
|    e     | 2.7182818285 |

### Functions
- abs (absolute value)
- rand (random number generator)
- sqrt (square root)
- cbrt (cube root)
- floor (round down)
- round (round to nearest whole number)
- ceil (round up)
- sin / asin
- cos / acos
- tan / atan
- log (logarithm)
- ln (natural logarithm)

### Expressions
- Expressions can be separated by using commas (,) in the input field
- Each expression will be evaluated separately, and the results will be displayed in the same order as the input

### Variables
- Supports arbitrary variable names (must not collide with constants or operators)
- A variable definition is an expression that starts with `[var_name] = ` where `[var_name]` is the variable's name
- Variables can be defined before or after an expression
- Variables that rely on eachother must be defined in the order that they're used in

### Other
- Supports both degree (deg) and radian (rad) modes
- Keeps track of the last 25 calculations and results

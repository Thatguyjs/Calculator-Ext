import { el } from "./common/element.mjs";

import Buttons from "./buttons.mjs";
import Calc from "./calc/calc.mjs";
import CalcHistory from "./history/history.mjs";
import Input from "./input.mjs";
import State from "./state.mjs";


Input.init();

Calc.set_elements(el('#error-input'), el('#error-message'));

Buttons.on('eval', text => {
	CalcHistory.handle_result(text, Calc.eval_and_display(text));
});

CalcHistory.set_element(el('#history'));

State.init();
State.set_elements(el('#angle-mode'));
State.load_state();

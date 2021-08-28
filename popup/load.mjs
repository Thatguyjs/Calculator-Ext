import CalcHistory from "./history.mjs";
import "./buttons.mjs";

import Main from "./main.mjs";


window.addEventListener('load', () => {
	CalcHistory.init();
	Main.init();
});

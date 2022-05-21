// Load icons into the document

import { el } from "./element.mjs";


const icon_src = await (await fetch('common/icons.svg')).text();
const icon_div = el('#icons');

icon_div.innerHTML = icon_src;

/**
 *  @copyright (c) 2020 Athaariq "Eric" Ardhiansyah and Contributors
 *  @see https://github.com/Thor-x86/varl-js/blob/master/LICENSE
 */

// This script is used for development using webpack

// To start development environment, use terminal to run command:
// npm run start

// To build minified JS bundle, use terminal to run command:
// npm run build

// Then you can access "varl" variable on console at browser
// to start experimenting
global.varl = require("./index");

// You can modify below to run something without browser's console
const body = document.body;
body.style.textAlign = "center";
body.style.verticalAlign = "middle";
body.style.color = "white";
body.style.backgroundColor = "black";
for(let iter = 0; iter < 6; iter++) body.innerHTML += '<br>';
body.innerHTML += '<h1>🔬 <b>VARL Development Lab</b></h1>';
body.innerHTML += '<h3><i>open <u>Inspect Element => Console</u> to start experiment</i></h3>';
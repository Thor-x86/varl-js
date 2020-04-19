# .varl v1.0 Encoder & Decoder for JS

**What is .varl?**

It's a simplest way to transfer data or store as configuration file. Here's the example

    full name = Athaariq Ardhiansyah

For more explanations, [see the documentation](https://github.com/Thor-x86/varl).

## Encoder & Decoder Information

Implements .varl version: **1.0.x**

Encoder & Decoder for JS version: **0.1.0**

## How to install?

1. Make sure you have installed latest NPM and NodeJS. If not, see [official download site](https://nodejs.org/en/).
2. Run on terminal: `npm install -S varl`
3. Now you can use .varl in JavaScript:
  `const varl = require('varl');`

## How to use?

Example snippet for encoding object into .varl string:

    var yourObject = {
	    'creature' : 'cat',
	    'name' : 'nyan',
	    'alive' : true
	};
	
	varl.encode(yourObject, result => {
		console.log(result); // get the result here
	});

To decode .varl string into an object:

    var encoded = "title = Hello, World!\ndescription = Lorem ipsum dolor amet";
    
    varl.decode(encoded, result => {
	    console.log(result); // get the result here
    });

By using jQuery, you can load and decode the data as example:

    $.get('myConfig.varl').done(data => {
	    varl.decode(result => {
		    console.log(result); // get the result here
	    });
    });

## How do I contribute?

This module facilitate contributors with realtime development environment from [webpack-dev-server](https://github.com/webpack/webpack-dev-server). So, when you made changes, the browser automatically load the modified code. Here's how to prepare:

1. Make sure you have installed latest NPM and NodeJS. If not, see [official download site](https://nodejs.org/en/).
2. Run on terminal: `git clone https://github.com/Thor-x86/varl-js`
3. Then run: `cd varl-js && npm install && npm start`
4. After the browser launched, you can modify and do experiment with varl-js source code now :)

For more information about contribution, see [our documentation](https://github.com/Thor-x86/varl/blob/master/docs/5-Contribution.md).

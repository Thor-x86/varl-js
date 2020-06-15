/**
 *  @copyright (c) 2020 Athaariq "Eric" Ardhiansyah and Contributors
 *  @see https://github.com/Thor-x86/varl-js/blob/master/LICENSE
 */

// Object that will be exposed
const VarlDecoder = {

    // Encode synchronously
    sync : input => {
        let lines = splitLines(input);
        return parseLines(lines);
    },

    // Decode asynchronously
    // NOTE: This function implements .sync(input) function
    //       into Promise. Modify sync function code will
    //       also modify this function
    async : (input, callback = null) => {
        let promise = new Promise(resolve => {
            let output = VarlDecoder.sync(input);
            resolve(output);
        });

        if(typeof(callback) == 'function') {
            promise.then(output => {
                callback(output);
                return output;
            });
        }

        return promise;
    }

}

// Common error message
const errorMessage = "Please use correct .varl format:\nkey1 = any value\nkey2 = any value\n...";

// Split lines to array object
// Required by: VarlDecoder.sync(input), parseValue(input)
function splitLines(input) {
    // Omit every carriers (\r) and remove excess whitespaces
    input = input.replace(/\r/g, "").trim();

    // These are bracket counter, allows multi-line array and object
    let numCurlyBracket = 0;
    let numSquareBracket = 0;

    // This will be returned from function
    let lineArray = [];

    // Marks if currently inside "..." or '...'
    let inStringChar = null;

    // Detect special characters and do something
    let startIndex = 0;
    for(let iter = 0; iter < input.length; iter++) {
        let eachChar = input[iter];

        // Check if now on the end-of-line
        if(iter == input.length - 1) {
            lineArray.push(input.substr(startIndex));
            if(numCurlyBracket > 0 && eachChar != "}") throw new SyntaxError("Excessive \"{\" bracket");
            if(numSquareBracket > 0 && eachChar != "]") throw new SyntaxError("Excessive \"[\" bracket");
            break;
        }
            
        // Keep in mind that each closing bracket ("}" or "]") won't split the line,
        // but new line (\n) did. Also keep in mind inside of switch(eachChar) is
        // priority-based, most top will be the most prioritized.
        let eachVariable = "";
        switch(eachChar) {
            case "*": // Remember, the asterisk ("*") marks the line of code is comment
                if(inStringChar !== null) break;
                let commentState = true;
                iter++;
                while(iter < input.length && commentState) {
                    if(input[iter] == "\n") {
                        commentState = false;
                        startIndex = iter + 1;
                    }
                    else iter++;
                }
            break;
            case "{":
                numCurlyBracket++;
            break;
            case "}":
                if(numCurlyBracket > 0) {
                    numCurlyBracket--;
                } else {
                    throw new SyntaxError("Excessive \"}\" bracket");
                }
            break;
            case "[":
                numSquareBracket++;
            break;
            case "]":
                if(numSquareBracket > 0) {
                    numSquareBracket--;
                } else {
                    throw new SyntaxError("Excessive \"]\" bracket");
                }
            break;
            case "\\":
                if(inStringChar === null) {
                    iter++;
                }
            break;
            case "\"":
                if(inStringChar === null) {
                    inStringChar = "\"";
                } else if(inStringChar === "\"") {
                    inStringChar = null;
                }
            break;
            case "\'":
                if(inStringChar === null) {
                    inStringChar = "\'";
                } else if(inStringChar === "\'") {
                    inStringChar = null;
                }
            break;
            case "\n":
                if(numCurlyBracket == 0 && numSquareBracket == 0) {
                    eachVariable = input.substring(startIndex,iter);
                    startIndex = iter + 1;
                    if(inStringChar !== null) {
                        throw new SyntaxError("You forgot the close quote (\")");
                    }
                }
            break;
        }
            
        // Normalize each splitted line
        eachVariable = eachVariable.trim();
        if(eachVariable != "") {
            lineArray.push(eachVariable);
        }

    } // for(let iter = 0; iter < input.length; iter++)

    return lineArray;

} // function splitLines(input)

// Get key and value for each lines
// Required by: VarlDecoder.sync(input), parseValue(input)
function parseLines(lines) {
    // This object will be returned from function
    let parsedObject = {};

    // This loop splits lines
    for(let iter = 0; iter < lines.length; iter++) {
        let eachLine = lines[iter];
        let equalSignIndex = findUnescapedEqual(eachLine);

        let eachKey = eachLine.substr(0, equalSignIndex).trim();
        eachKey = decodeString(eachKey);
        if(eachKey == "") throw new SyntaxError(errorMessage);

        let eachValue = eachLine.substr(equalSignIndex + 1).trim();
        eachValue = parseValue(eachValue);

        parsedObject[eachKey] = eachValue;
    }

    // Return the result
    return parsedObject;

} // function parseLines(lines)

// Required by: parseLines(lines)
function findUnescapedEqual(eachLine) {
    // Marks if currently inside "..." or '...'
    let inStringChar = null;

    // Find for unescaped equal sign (=) line by line
    for(let iter = 0; iter < eachLine.length; iter++) {
        let eachChar = eachLine[iter];

        switch(eachChar) {

            case "\\":
                iter++;
            break;
            case "\"":
                if(inStringChar === null) {
                    inStringChar = "\"";
                } else if(inStringChar === "\"") {
                    inStringChar = null;
                }
            break;
            case "\'":
                if(inStringChar === null) {
                    inStringChar = "\'";
                } else if(inStringChar === "\'") {
                    inStringChar = null;
                }
            break;
            case "=": if(iter == 0) {
                throw new SyntaxError(errorMessage);
            } else {
                if(inStringChar === null) return iter;
            }

        } // switch(eachChar)

    } // for(let iter = 0; iter < eachLine.length; iter++)

    // Inform if quote isn't closed
    if(inStringChar == "\"") throw new SyntaxError("You forgot the close quote (\")");
    if(inStringChar == "\'") throw new SyntaxError("You forgot the close quote (\')");

    // If no equal sign (=) detected, VarlDecoder will assume the input uses incorrect format
    throw new SyntaxError(errorMessage);
}

// Replace escaped characters into their original state
// Required by: parseLines(lines)
function decodeString(input) {
    let output = input.trim();
    if(output.startsWith('"') && output.endsWith('"') && !output.endsWith("\\\"")) {
        output = output.substr(1, output.length-2)
            .replace(/\\\n/gm,"\n")
            .replace(/\\\t/gm,"\t")
            .replace(/\\\"/gm, "\"")
            .replace(/\\\'/gm, "\'")
            .replace(/\\\\/gm, "\\");
    } else if(output.startsWith("\'") && output.endsWith("\'") && !output.endsWith("\\\'")) {
        output = output.substr(1, output.length-2)
            .replace(/\\\'/gm, "\'");
    }
    return output;
}

// Detect the value's type data then convert it into JS' variable
// Required by: parseLines(lines), decodeArray(input)
function parseValue(input) {
    let output;
    
    if(input.startsWith("{") && input.endsWith("}")) {
        // If object, then:
        let varlObject = input.substr(1, input.length-2);
        let lines = splitLines(varlObject.trim());
        output = parseLines(lines);
    } else if(input.startsWith("[") && input.endsWith("]")) {
        // If array, then:
        let varlArray = input.substr(1, input.length-2);
        output = decodeArray(varlArray);
    } else if(input.startsWith("\"") && input.endsWith("\"")) {
        // If string, then:
        output = decodeString(input);
    } else if(input.startsWith("\'") && input.endsWith("\'")) {
        // If raw string, then:
        output = decodeString(input);
    } else if(input == "true") {
        // If "true" boolean, then:
        output = true;
    } else if(input == "false") {
        // If "false" boolean, then:
        output = false;
    } else if(!isNaN(input)) {
        // If a number, then check if it's float or any else
        if(input.includes(".") || input.includes("e")) {
            // If float or scientific, then:
            output = parseFloat(input);
        } else if(input.startsWith("0o")) {
            // If octal, then:
            output = parseInt(input.substr(2), 8);
        } else {
            // If integer or hex, then:
            output = parseInt(input);
        }
    } else {
        // Otherwise will be assumed as string
        output = decodeString(input);
    }

    return output;

} // function parseValue(input)

// Decode string that represents array into real array
// Required by: parseValue(input)
function decodeArray(input) {
    // These are bracket counter, allows multi-line array and object
    let numCurlyBracket = 0;
    let numSquareBracket = 0;

    // Marks if currently inside "..." or '...'
    let inStringChar = null;

    // Array that will be returned by function
    let output = [];

    // Analyze character-by-character
    let startIndex = 0;
    for(let iter = 0; iter < input.length; iter++) {
        let eachChar = input[iter];
        
        // If end-of-line, then:
        if(iter == (input.length - 1)) {
            let eachArrayItem = input.substring(startIndex, input.length);
            let eachValue = parseValue(eachArrayItem.trim());
            if(numCurlyBracket > 0 && eachChar != "}") throw new SyntaxError("Excessive \"{\" bracket");
            if(numSquareBracket > 0 && eachChar != "]") throw new SyntaxError("Excessive \"[\" bracket");
            output.push(eachValue);
        }

        // Analyze current character:
        switch(eachChar) {

            case "*": // Remember, the asterisk ("*") marks the line of code is comment
                if(inStringChar !== null) break;
                let commentState = true;
                iter++;
                while(iter < input.length && commentState) {
                    if(input[iter] == "\n") {
                        commentState = false;
                        startIndex = iter + 1;
                    }
                    else iter++;
                }
            break;
            case "{":
                numCurlyBracket++;
            break;
            case "}":
                if(numCurlyBracket > 0) {
                    numCurlyBracket--;
                } else {
                    throw new SyntaxError("Excessive \"}\" bracket");
                }
            break;
            case "[":
                numSquareBracket++;
            break;
            case "]":
                if(numSquareBracket > 0) {
                    numSquareBracket--;
                } else {
                    throw new SyntaxError("Excessive \"]\" bracket");
                }
            break;
            case "\\":
                if(inStringChar === null) {
                    iter++;
                }
            break;
            case "\"":
                if(inStringChar === null) {
                    inStringChar = "\"";
                } else if(inStringChar === "\"") {
                    inStringChar = null;
                }
            break;
            case "\'":
                if(inStringChar === null) {
                    inStringChar = "\'";
                } else if(inStringChar === "\'") {
                    inStringChar = null;
                }
            break;
            case ",":
                if(numCurlyBracket == 0 && numSquareBracket == 0 && inStringChar === null) {
                    let eachArrayItem = input.substring(startIndex,iter);
                    let eachValue = parseValue(eachArrayItem.trim());
                    output.push(eachValue);
                    startIndex = iter + 1;
                }
            break;

        } // switch(eachChar)

        // Check if forgot to put another pair of quote ( " )
        if(inStringChar == "\"") throw new SyntaxError("You forgot the close quote (\")");
        if(inStringChar == "\'") throw new SyntaxError("You forgot the close quote (\')");
        
    } // for(let iter = 0; iter < input.length; iter++)

    // Return the result
    return output;
}

// Expose VarlDecoder object
export default VarlDecoder;
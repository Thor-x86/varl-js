/**
 *  @copyright (c) 2020 Athaariq "Eric" Ardhiansyah and Contributors
 *  @see https://github.com/Thor-x86/varl-js/blob/master/LICENSE
 */

// Object that will be exposed
const VarlEncoder = {

    // Encode synchronously
    sync : input => {
        return encodeObject(input).replace(/\n/gm, "\r\n");
    },

    // Encode asynchronously
    // NOTE: This function implements .sync(input) function
    //       into Promise. Modify sync function code will
    //       also modify this function
    async : (input, callback) => {
        let promise = new Promise(resolve => {
            let output = VarlEncoder.sync(input);
            resolve(output);
        });

        promise.then(output => callback(output));

        return promise;
    },

}; // const VarlEncoder

function encodeObject(input, indentCount = 0) {

    // Take cares of indentation if current object inside an object
    let indent = "";
    for(let iter = 0; iter < indentCount; iter++) {
        indent += "\t";
    }

    // Get keys, they would be index numbers if input is array
    let keys = getKeys(input);

    // String that will be returned from function
    let output = "";
    
    for(let iter = 0; iter < keys.length; iter++) {
        // Get each key and number
        let eachKey = keys[iter];
        let eachValue = input[eachKey];

        eachKey = encodeString(eachKey);

        // Prevents any chaos because of JS'
        // .toString( ... ) conversion
        eachValue = stringifyValue(eachValue, false, indentCount);

        // Put new line if it's not the first line
        if(output.length > 0) output += "\n";

        // Put "key = value" pair
        output += indent + eachKey + " = " + eachValue;

    } // for(let iter = 0; iter < keys.length; iter++)

    return output;

} // function encodeObject(input)

// Required by: encodeObject(input)
function getKeys(input) {
    let output = [];
    if(Array.isArray(input)) {
        for(let iter = 0; iter < input.length; input++) {
            output.push(iter);
        }
    } else {
        output = Object.keys(input);
    }
    return output;
}

// Required by: encodeObject(input), encodeArray(input)
function stringifyValue(input, enforceQuotizeValue = false, indentCount = 0) {
    let output;

    if(typeof(input) == "string") {
        // if already string:
        output = encodeString(input, enforceQuotizeValue);
    } else if(typeof(input) == "object" && input !== null) {
        if(Array.isArray(input)) {
            // if an array:
            output = encodeArray(input, indentCount);
        } else {
            // if an object:
            output = "{\n" + encodeObject(input, indentCount+1) + "\n";
            for(let iter = 0; iter < indentCount; iter++) {
                // This below for close bracket's indentation
                output += "\t";
            }
            output += "}";
        }
    } else if(typeof(input) == "boolean") {
        output = input;
    } else if(input === null || input === undefined) {
        // if an empty value:
        output = "";
    } else if(typeof(input) == "number") {
        // if a number:
        output = parseFloat(String(input));
    }

    return output;
}

// Required by: stringifyValue(input)
function encodeString(input, enforceQuotizeValue = false) {
    let output = input;
    if(isNeedQuote(input) || enforceQuotizeValue) {
        output = output
            .replace(/\\/gm, "\\\\")
            .replace(/\n/gm,"\\n")
            .replace(/\t/gm,"\\t")
            .replace(/\"/gm, "\\\"")
            .replace(/\'/gm, "\\\'");
        output = `"${output}"`;
    }
    return output;
}

// Required by: stringifyValue(input)
function encodeArray(input, indentCount = 0) {
    let output = "[";
    for(let iter = 0; iter < input.length; iter++) {
        if(output.length > 1) output += ", ";
        output += stringifyValue(input[iter], true, indentCount);
    }
    output += "]";
    return output;
}

// Required by: encodeString(input)
function isNeedQuote(data) {
    if(typeof(data) == "string") {
        return (data.match(/((^\s)|\"|\=|\'|\`|(\s$))/) != null);
    } else {
        return false;
    }
}

// Expose VarlEncoder object
export default VarlEncoder;
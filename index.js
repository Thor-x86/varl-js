const VarlEncoder = require("./src/VarlEncoder").default;
const VarlDecoder = require("./src/VarlDecoder").default;

/**
 *  @copyright (c) 2020 Athaariq "Eric" Ardhiansyah and Contributors
 *  @see https://github.com/Thor-x86/varl-js/blob/master/LICENSE
 */

/**
 *  NOTE: If you want modify and test this source,
 *        @see lab.js script
 */

/**
 *  Interface to VARL encoder and decoder
 *  
 *  @method encode
 *  @method encodeSync
 *  @method decode
 *  @method decodeSync
 */
module.exports = {

    /**
     *  Convert from object into VARL-formatted string synchronously
     * 
     *  @param {object} input Object that intended to be encoded
     *  @returns {string} VARL-formatted string result
     */
    encodeSync : input => {
        // Check if someone confused encode with decode
        if(typeof(input) == "string") throw new TypeError("Did you mean .decodeSync(...)?");

        return VarlEncoder.sync(input)
    },

    /**
     *  Callback that will be called after async process done
     *  
     *  @callback encodeFinishCallback
     *  @param {string} output VARL-formatted string result
     */

    /**
     *  Convert from object into VARL-formatted string asynchronously
     * 
     *  @param {object} input Object that intended to be encoded
     *  @param {encodeFinishCallback} callback On finish callback
     *  @returns {Promise} Useful for "callback hell" prevention and catches the error
     */
    encode : (input, callback) => {
        // Check if someone confused encode with decode
        if(typeof(input) == "string") throw new TypeError("Did you mean .decode(...)?");

        return VarlEncoder.async(input, callback)
    },

    /**
     *  Convert from VARL-formatted string into object synchronously
     * 
     *  @param {string} input VARL-formatted string
     *  @returns {object} Object result
     */
    decodeSync : input => {
        // Check if someone confused decode with encode
        if(typeof(input) != "string") throw new TypeError("Did you mean .encodeSync(...)?");

        return VarlDecoder.sync(input)
    },

    /**
     *  Callback that will be called after async process done
     *  
     *  @callback decodeFinishCallback
     *  @param {object} output Object result
     */

    /**
     *  Convert from VARL-formatted string into object asynchronously
     * 
     *  @param {string} input VARL-formatted string
     *  @param {decodeFinishCallback} callback On finish callback
     *  @returns {Promise} Useful for "callback hell" prevention and catches the error
     */
    decode : (input, callback) => {
        // Check if someone confused decode with encode
        if(typeof(input) != "string") throw new TypeError("Did you mean .encode(...)?");

        return VarlDecoder.async(input, callback);
    }

}
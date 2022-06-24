function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}


function NLPEscape(tags) {
    this.tags_ = Array.from(new Set(tags)).sort();
    this.mapping = {}
    for (let index = 0; index < this.tags_.length; index++) {
        this.mapping[this.tags_[index]] = "\0".repeat(index + 1);
    }
    this.reverseMapping = swap(this.mapping);
    this.codes_ = Object.values(this.mapping).reverse();
    /**
     * Escape tags from a string
     * @param  {String} text
     * @return {String}
     */
    this.escape = (text) => {
        let output = text
        const tags = this.tags_.slice() // Save the initial object state (tags)
        for (let tag; (tag = tags.shift()); ) {
            let position = output.indexOf(tag);
            for (; position > -1; position = output.indexOf(tag)) {
                let re = new RegExp(tag, "g");
                output = output.replace(re, this.mapping[tag]);
            }
        }
        return output;
    },

    /**
     * Recover the initial tagged string
     * @param  {String} text
     * @return {String}
     */
    this.unescape = (text) => {
        let output = text
        const codes = this.codes_.slice() // Save the initial object state (codes)
        for (let code; (code = codes.shift()); ) {
            let position = output.indexOf(code);
            for (; position > -1; position = output.indexOf(code)) {
                let re = new RegExp(code, "g");
                output = output.replace(re, this.reverseMapping[code]);
            }
        }
        return output;
    };
}
/**
 * Escapes then recovers chosen tags from a natural language.
 */
module.exports = {
    NLPEscape: NLPEscape
};

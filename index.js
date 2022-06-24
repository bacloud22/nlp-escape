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
        const tags = this.tags_ // Save the initial object state (tags)
        for (let tag; (tag = tags.shift()); ) {
            let position = text.indexOf(tag);
            for (; position > -1; position = text.indexOf(tag)) {
                let re = new RegExp(tag, "g");
                text = text.replace(re, mapping[tag]);
            }
        }
        return text;
    },

    /**
     * Recover the initial tagged string
     * @param  {String} text
     * @return {String}
     */
    this.unescape = (text) => {
        const codes = this.codes_ // Save the initial object state (codes)
        for (let code; (code = codes.shift()); ) {
            let position = text.indexOf(code);
            for (; position > -1; position = text.indexOf(code)) {
                let re = new RegExp(code, "g");
                text = text.replace(re, reverseMapping[code]);
            }
        }
        return text;
    };
}
/**
 * Escapes then recovers chosen tags from a natural language.
 */
module.exports = {
    NLPEscape: NLPEscape
};

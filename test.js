const NLPEscape = require("./index").NLPEscape;

let text =
  "this is a <b>big</b> data text. But what is big data? <a>read more</a>." +
  "Then <i>vＥⓡ𝔂 𝔽𝕌Ňℕｙ</i>ţ乇𝕏𝓣 and finally ssn:987477475 ssn:987 47 7475 wow this is working";
console.log(text);

const lib = new NLPEscape(["<a>", "<b>", "</b>", "</a>", "</i>", "</i>"]);
const clean = lib.escape(text);
console.log(clean);


text = lib.unescape(clean);
console.log(text);
// State is fine ?
text = lib.unescape(clean);
console.log(text);
// TODO: it is not, (because of str#shift())

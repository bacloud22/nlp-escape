const NLPEscape = require("./index").NLPEscape;

let text =
  "this is a <b>big</b> data text. But what is big data? <a>read more</a>." +
  "Then <i>vＥⓡ𝔂 𝔽𝕌Ňℕｙ</i> ţ乇𝕏𝓣 and finally ssn:987477475 ssn:987 47 7475 wow this is working";
console.log(text);

const lib = new NLPEscape(["<a>", "<b>", "</b>", "</a>", "<i>", "</i>"]);
const clean = lib.escape(text);
console.log(clean);

text = lib.unescape(clean);
console.log(text);
// State is fine ?
text = lib.unescape(clean);
console.log(text);

// Real world example
// This is one of your pipeline stages (external library)
const decancer = require("decancer");
// List of things to censor
// Credit: http://www.richardsramblings.com/regex/credit-card-numbers/
// Credit: https://codepen.io/gpeu/pen/eEdvmO
const reb = {
  electron: /\b(4026|417500|4405|4508|4844|4913|4917)[ -./\\]?\d{4}[ -./\\]?\d{4}\d{3,4}\b/g,
  maestro:
      /\b(?:5[0678]\d\d|6304|6390|67\d\d)[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?(?:\d{4})?[ -./\\]?(?:\d{1,3})?\b/g,
  dankort: /\b(5019)[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
  instaPayment: /\b(637|638|639)[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{1}\b/g,
  visa: /\b4\d{3}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{1,4}\b/g,
  mastercard: /\b5[1-5]\d{2}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
  amex: /\b3[47]\d{2}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{3}\b/g,
  diners: /\b3(?:0[0-5]|[68]\d)\d{1}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{2}\b/g,
  discover: /\b6(?:011|5\d{2}|22[19]|4[56789]\d{1})[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
  jcb: /\b(?:2131|1800|35\d[28-89])[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
  ssn: /\b\d{3}[ -./\\]?\d{2}[ -./\\]?\d{4}\b/g,
}
const rew = {
  phone: /\b(?:(?:\(\d{3}\)?)|(?:\d{3}))[ -./\\]?\d{3}[ -./\\]?\d{4}\b/g,
}
// This is one of your pipeline stages (in-house)
function cleanSensitive(blob, maxLen) {
  if (maxLen === 0) return "";
  if (maxLen < 9) return blob;
  if (blob.length > 9) {
    const whitelisted = [];
    for (const regexW in rew) {
      if (Object.prototype.hasOwnProperty.call(rew, regexW)) {
        blob = blob.replace(
          rew[regexW],
          function (match, index) {
            this.push({ i: index, m: match });
            return "";
          }.bind(whitelisted)
        );
      }
    }
    const maskStr = (match) => new Array(match.length + 1).join("X");
    for (const regexB in reb) {
      if (Object.prototype.hasOwnProperty.call(reb, regexB)) {
        blob = blob.replace(reb[regexB], maskStr);
      }
    }
    whitelisted.forEach((w) => {
      blob = blob.slice(0, w.i) + w.m + blob.slice(w.i);
    });
  }
  if (maxLen && blob.length >= this.maxLen) {
    blob = blob.substr(0, this.maxLen - 1);
  }
  return blob;
}

function stringTransformer(s) {
  var internal = String(s);
  this.cleanSensitive = function () {
    internal = cleanSensitive(internal);
    return this;
  };
  this.decancer = function () {
    internal = decancer(internal);
    return this;
  };
  this.valueOf = function () {
    return internal;
  };
}
// Pipeline execution
const res = new stringTransformer(clean).decancer().cleanSensitive().valueOf()
console.log(res)
// Recover tags
const final = lib.unescape(res);
console.log(final)


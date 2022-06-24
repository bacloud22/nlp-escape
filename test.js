const test = require("ava");
const NLPEscape = require("./index").NLPEscape;

let text =
  "this is a <b>big</b> data text. But what is big data? <a>read more</a>." +
  "Then <i>vＥⓡ𝔂 𝔽𝕌Ňℕｙ</i> ţ乇𝕏𝓣 and finally ssn:987477475 ssn:987 47 7475 wow this is working";
console.log(`Original input:\n ${text}\n`);

test("Escape keeps natural language intact", (t) => {
  const lib = new NLPEscape(["<a>", "<b>", "</b>", "</a>", "<i>", "</i>"]);
  const clean = lib.escape(text);
  const strippedClean = clean.split(/[\0]+/);
  const strippedHTML = text.split(/<[^>]*>?/);
  strippedHTML.forEach((str, idx) => {
    t.is(str, strippedClean[idx]);
  });
});

test("Unescape reverts escape", async (t) => {
  const lib = new NLPEscape(["<a>", "<b>", "</b>", "</a>", "<i>", "</i>"]);
  const clean = lib.escape(text);
  let original = lib.unescape(clean);
  t.is(text, original);
});

test("Real world example. Please use your own pipeline and compare results", async (t) => {
  const lib = new NLPEscape(["<a>", "<b>", "</b>", "</a>", "<i>", "</i>"]);
  const clean = lib.escape(text);
  const result = new stringTransformer(clean)
    .decancer()
    .cleanSensitive()
    .valueOf();
  let original = lib.unescape(result);
  console.log(`\nRecovered results:\n ${original}`);
  t.pass();
});

// Real world example
// This is one of your pipeline stages (external library)
const decancer = require("decancer");
// This is one of your pipeline stages (in-house)
// List of things to censor
// Credit: http://www.richardsramblings.com/regex/credit-card-numbers/ && https://codepen.io/gpeu/pen/eEdvmO
const reb = {
  discover:
    /\b6(?:011|5\d{2}|22[19]|4[56789]\d{1})[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
  jcb: /\b(?:2131|1800|35\d[28-89])[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
  ssn: /\b\d{3}[ -./\\]?\d{2}[ -./\\]?\d{4}\b/g,
};
const rew = {
  phone: /\b(?:(?:\(\d{3}\)?)|(?:\d{3}))[ -./\\]?\d{3}[ -./\\]?\d{4}\b/g,
};
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

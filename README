# NLP Escape
A generic pre escape and post recover text tags for NLP/ML pipelines - **Use at your own risk !**

## Context
NLP (natural language processing) by definition deals with human language as it is spoken and written. We are considering any written language here.  
In the same time, text to be processed could be tagged in many ways. HTML, XML, POS tagging, etc.

Since you are here, You are most likely using external NLP libraries that has their own logics and considerations; ie, external libraries don't know about your data ! and You should remove tags before processing the natural language

But why you need to remove tags before processing ? Simply because it is very likely that tags would confuse or lower machine learning efficiency.

Again, their might be some solution to some case and library, but -I think there is no general solution to strip tags from text, do the processing then recover the initial structure.
It is hard to think of a general solution because I think there is simply no one. But why ?

Having:

`Hello world <tag>blablablabla hellooooo</tag> and so on. That was a vＥⓡ𝔂 𝔽𝕌Ňℕｙ ţ乇𝕏𝓣. Not only, I am leaving my credit card for You: <red>4929 9425 8354 2322 - Visa</red> here you have it !`

You can think of indexing tags, processing text then recover tags. But NLP is more than capitalizing text, imagine you are using doing these processing:  
- [Decancer](https://github.com/null8626/decancer/)
- In-house masking privacy
- [bad-words](https://www.npmjs.com/package/bad-words)
- [misspellings](https://www.npmjs.com/package/misspellings)

These nice libraries will change text, and some of them will shrink or grow its size !

**NLP-Escape** is a generic solution that will make your life easier :)

## Considerations

**NLP-Escape** simply maps and replaces each tag with a unique codification using the [Null character](https://en.wikipedia.org/wiki/Null_character) and the null character in JavaScript is `\0`.  
My first version encodes text by replacing tags with a succession of `\0` (this might change in future versions).
As you have understood, this assumes **there are no `\0` already in the initial text** and comes with the obvious costs:

- Replacing a tag with a succession of `\0` could shrink or grow the text to be processed.
- **The succession of `\0` might confuse the NLP libraries as well (just like tags themselves). But I think this is unlikely to happen (null character is rarely dealt with in one way or another) so YOU MUST DO TESTS TO VALIDATE THIS**
- Because of the first consideration, this is subject to some kind of zip bombing attack ! a text like `<a><b><c>...<i>...<n>` would grow considerably.
- The remedy to this is the construction of a limited tags dictionary (this is what we do here ! You specify tags to be escaped manually).


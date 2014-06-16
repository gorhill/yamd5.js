### YaMD5 - Yet another MD5 hasher

I needed an MD5 hasher, and as usual I want small code base, and fast.

Originally found [md5-o-matic](https://github.com/trentmillar/md5-o-matic).
It was fast but did not work with Unicode strings.
Also, I eventually realized it was really based on [code from 
Joseph Myers](http://www.myersdaily.org/joseph/javascript/md5-text.html), which 
is itself a javascript adapation of the C language version the reference 
implementation of MD5 in Appendix 3 of 
[RFC 1321](http://www.rfc-editor.org/rfc/rfc1321.txt).

Then I found [SparkMD5](https://github.com/satazor/SparkMD5), which works
with Unicode strings, but at a steep cost to performance on large input strings. 
Also, glancing at the code I saw avoidable redundancies causing the code base 
to be larger than needed.

So from this point I set out to write my own version, YaMD5 (sorry, I am 
not good with naming projects), of course heavily relying on the [original 
code from Joseph Myers](http://www.myersdaily.org/joseph/javascript/md5-text.html), 
(with modifications to incrementally improve performance as per profiling), 
and bits from [SparkMD5](https://github.com/satazor/SparkMD5) -- I started to 
work from SparkMD5 implementation, so there might be code original to 
SparkMD5 I kept in a few places (like say, code in md5.end() etc.)

### Benefits of YaMD5

- Can handle Unicode strings
- Natively incremental
- Small code base
- Fastest MD5 hasher out there so far for large input:
    * See <http://jsperf.com/md5-shootout/48>.
    * See <http://jsperf.com/md5-shootout/50> for implementations which supports Unicode strings.
    * Notes regarding the above _MD5 shootout_ benchmark:
        - Support both ASCII and Unicode strings:
            * YaMD5
            * [SparkMD5](https://github.com/satazor/SparkMD5)
            * [Paul Johnston's MD5 ("Paj's MD5")](http://pajhome.org.uk/crypt/md5/md5.html)
            * [js-crypto's MD5 ("TinyMD5")](https://github.com/jbt/js-crypto)
        - Supports only ASCII strings:
            * [Masanao Izumo's MD5 ("MD5_hexhash")](http://www.onicos.com/staff/iz/amuse/javascript/expert/md5.txt)
            * [Joseph Myers's MD5 ("jkm MD5"](http://www.myersdaily.org/joseph/javascript/md5-text.html)
            * [Trent Millar's MD5 ("MD5-o-matic")](https://github.com/trentmillar/md5-o-matic)
            * [iReal's MD5 ("FastMD5")](https://github.com/iReal/FastMD5)
        - _valums MD5_ code fails both ASCII and Unicode strings: **Do not use**.

### Usage

One pass:

    YaMD5.hashStr('hello\n') === "b1946ac92492d2347c6235b4d2611184"

Incremental:

    var md5Hasher = new YaMD5();
    ...
    md5Hasher.start();
    md5Hasher.appendStr('hello');
    md5Hasher.appendStr(' ');
    md5Hasher.appendStr('world');
    md5Hasher.appendStr('\n');
    md5Hasher.end() === '6f5902ac237024bdd0c176cb93063dc4';

### License

I don't know what license covers Joseph Myers' code (need
to find out). In any case, concerning whatever original code I contributed in
there:

The MIT License (MIT)

Copyright (C) 2014 Raymond Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

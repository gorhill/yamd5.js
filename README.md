### YaMd5 - Yet another MD5 hasher

I needed an MD5 hasher, and as usual I want small code base, and fast.

Originally found [md5-o-matic](https://github.com/trentmillar/md5-o-matic).
It was fast but did not work with Unicode strings.
Also, I eventually realized it was really based on [code from
Joseph Myers](http://www.myersdaily.org/joseph/javascript/md5-text.html) with
no proper credits (not nice).

Then I found [SparkMD5](https://github.com/satazor/SparkMD5), which works
with Unicode string, but at a steep cost to performance. Also, glancing at
the code I saw avoidable redundancies causing the code base to be much larger
than needed.

So from this point I set out to write my own version, YaMd5 (sorry, I am
not good with naming projects), of course heavily relying on the [original
code from Joseph Myers](http://www.myersdaily.org/joseph/javascript/md5-text.html),
(with modifications to incrementally improve performance as per profiling),
and bits from [SparkMD5](https://github.com/satazor/SparkMD5) -- I started to
work from SparkMD5 implementation, so there might be code original to
SparkMD5 I kept in a few places (like say, code in md5.end() etc.)

### Benefits of YaMd5

- Can handle Unicode strings
- Natively incremental
- Small code base
- Fastest MD5 hasher out there so far (see ,http://jsperf.com/md5-shootout/44>)
- Even faster than versions supporting only simpler ascii strings

### Usage

One pass:

    YaMd5.hashStr('hello\n') === "b1946ac92492d2347c6235b4d2611184"

Incremental:

    var md5Hasher = new YaMd5();
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

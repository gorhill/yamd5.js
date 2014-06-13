### YaMd5 - Yet another MD5 hasher

I needed an MD5 hasher, and as usual I want small code base, and fast.

Originally found md5-o-matic [1]. It was fast but did not work with Unicode
string. Also, eventually realized it was really based on code from
Joseph Myers [2] with no proper credits (not nice).

Then I found SparkMD5 [3], which works with Unicode string, but at a steep
cost to performance. Also, glancing at the code I saw avoidable redundancies
causing the code base to be much larger than needed.

So from this point I set out to write my own version, YaMd5 (sorry, I am
not good with naming projects), of course heavily relying on the original
code from Joseph Myers [2], and bits from SparkMD5 -- I started to work from
SparkMD5 implementation, so there might be bits of code original to SparkMD5
code left in a few places (like say, md5.end()).

### Benefits of YaMd5

- Can handle Unicode strings
- Natively incremental
- Small code base
- Fastest MD5 hasher out there so far [4]
- Even faster than versions supporting only simpler ascii strings

[1] <https://github.com/trentmillar/md5-o-matic>
[2] <http://www.myersdaily.org/joseph/javascript/md5-text.html>
[3] <https://github.com/satazor/SparkMD5>
[4] <http://jsperf.com/md5-shootout/44>

So with that said, I don't know what license covers Joseph Myers' code (need
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

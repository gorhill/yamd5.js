/*******************************************************************************

YaMD5 - Yet another MD5 hasher.
home: https://github.com/gorhill/yamd5.js

I needed an MD5 hasher, and as usual I want small code base, and fast.

Originally found md5-o-matic [1]. It was fast but did not work with Unicode
strings. Also, eventually realized it was really based on code from
Joseph Myers [2] with no proper credits given (not nice).

Then I found SparkMD5 [3], which works with Unicode strings, but at a steep
cost to performance. Also, glancing at the code I saw avoidable redundancies
causing the code base to be much larger than needed.

So from this point I set out to write my own version, YaMD5 (sorry, I am
not good with naming projects), of course heavily relying on the original
code from Joseph Myers [2], and bits from SparkMD5 -- I started to work from
SparkMD5 implementation, so there might be bits of code original to SparkMD5
code left in a few places (like say, MD5.end()).

Advantages of YaMD5:

- Can handle Unicode strings
- Natively incremental
- Small code base
- Fastest MD5 hasher out there so far for large input [4]
- Even faster than versions supporting only simpler ascii strings


 [1] https://github.com/trentmillar/md5-o-matic
 [2] http://www.myersdaily.org/joseph/javascript/md5-text.html
 [3] https://github.com/satazor/SparkMD5
 [4] http://jsperf.com/md5-shootout/48

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

**/

/* jshint bitwise: false */

(function(root) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5)
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

    //var ff = function(a, b, c, d, x, s, t) {
    //    a += (b & c | ~b & d) + x + t;
    //    return ((a << s | a >>> (32 - s)) + b) | 0;
    //};
    var ff7 = function(a, b, c, d, x, t) {
        a += (b & c | ~b & d) + x + t;
        return ((a << 7 | a >>> 25) + b) | 0;
    };
    var ff12 = function(a, b, c, d, x, t) {
        a += (b & c | ~b & d) + x + t;
        return ((a << 12 | a >>> 20) + b) | 0;
    };
    var ff17 = function(a, b, c, d, x, t) {
        a += (b & c | ~b & d) + x + t;
        return ((a << 17 | a >>> 15) + b) | 0;
    };
    var ff22 = function(a, b, c, d, x, t) {
        a += (b & c | ~b & d) + x + t;
        return ((a << 22 | a >>> 10) + b) | 0;
    };
    //var gg = function(a, b, c, d, x, s, t) {
    //    a += (b & d | c & ~d) + x + t;
    //    return ((a << s | a >>> (32 - s)) + b) | 0;
    //};
    var gg5 = function(a, b, c, d, x, t) {
        a += (b & d | c & ~d) + x + t;
        return ((a << 5 | a >>> 27) + b) | 0;
    };
    var gg9 = function(a, b, c, d, x, t) {
        a += (b & d | c & ~d) + x + t;
        return ((a << 9 | a >>> 23) + b) | 0;
    };
    var gg14 = function(a, b, c, d, x, t) {
        a += (b & d | c & ~d) + x + t;
        return ((a << 14 | a >>> 18) + b) | 0;
    };
    var gg20 = function(a, b, c, d, x, t) {
        a += (b & d | c & ~d) + x + t;
        return ((a << 20 | a >>> 12) + b) | 0;
    };
    //var hh = function(a, b, c, d, x, s, t) {
    //    a += (b ^ c ^ d) + x + t;
    //    return ((a << s | a >>> (32 - s)) + b) | 0;
    //};
    var hh4 = function(a, b, c, d, x, t) {
        a += (b ^ c ^ d) + x + t;
        return ((a << 4 | a >>> 28) + b) | 0;
    };
    var hh11 = function(a, b, c, d, x, t) {
        a += (b ^ c ^ d) + x + t;
        return ((a << 11 | a >>> 21) + b) | 0;
    };
    var hh16 = function(a, b, c, d, x, t) {
        a += (b ^ c ^ d) + x + t;
        return ((a << 16 | a >>> 16) + b) | 0;
    };
    var hh23 = function(a, b, c, d, x, t) {
        a += (b ^ c ^ d) + x + t;
        return ((a << 23 | a >>> 9) + b) | 0;
    };

    //var ii = function(a, b, c, d, x, s, t) {
    //    a += (c ^ (b | ~d)) + x + t;
    //    return ((a << s | a >>> (32 - s)) + b) | 0;
    //};
    var ii6 = function(a, b, c, d, x, t) {
        a += (c ^ (b | ~d)) + x + t;
        return ((a << 6 | a >>> 26) + b) | 0;
    };
    var ii10 = function(a, b, c, d, x, t) {
        a += (c ^ (b | ~d)) + x + t;
        return ((a << 10 | a >>> 22) + b) | 0;
    };
    var ii15 = function(a, b, c, d, x, t) {
        a += (c ^ (b | ~d)) + x + t;
        return ((a << 15 | a >>> 17) + b) | 0;
    };
    var ii21 = function(a, b, c, d, x, t) {
        a += (c ^ (b | ~d)) + x + t;
        return ((a << 21 | a >>> 11) + b) | 0;
    };

    var md5cycle = function(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a =  ff7(a, b, c, d,  k[0], -680876936);
        d = ff12(d, a, b, c,  k[1], -389564586);
        c = ff17(c, d, a, b,  k[2], 606105819);
        b = ff22(b, c, d, a,  k[3], -1044525330);
        a =  ff7(a, b, c, d,  k[4], -176418897);
        d = ff12(d, a, b, c,  k[5], 1200080426);
        c = ff17(c, d, a, b,  k[6], -1473231341);
        b = ff22(b, c, d, a,  k[7], -45705983);
        a =  ff7(a, b, c, d,  k[8], 1770035416);
        d = ff12(d, a, b, c,  k[9], -1958414417);
        c = ff17(c, d, a, b, k[10], -42063);
        b = ff22(b, c, d, a, k[11], -1990404162);
        a =  ff7(a, b, c, d, k[12], 1804603682);
        d = ff12(d, a, b, c, k[13], -40341101);
        c = ff17(c, d, a, b, k[14], -1502002290);
        b = ff22(b, c, d, a, k[15], 1236535329);

        a =  gg5(a, b, c, d,  k[1], -165796510);
        d =  gg9(d, a, b, c,  k[6], -1069501632);
        c = gg14(c, d, a, b, k[11], 643717713);
        b = gg20(b, c, d, a,  k[0], -373897302);
        a =  gg5(a, b, c, d,  k[5], -701558691);
        d =  gg9(d, a, b, c, k[10], 38016083);
        c = gg14(c, d, a, b, k[15], -660478335);
        b = gg20(b, c, d, a,  k[4], -405537848);
        a =  gg5(a, b, c, d,  k[9], 568446438);
        d =  gg9(d, a, b, c, k[14], -1019803690);
        c = gg14(c, d, a, b,  k[3], -187363961);
        b = gg20(b, c, d, a,  k[8], 1163531501);
        a =  gg5(a, b, c, d, k[13], -1444681467);
        d =  gg9(d, a, b, c,  k[2], -51403784);
        c = gg14(c, d, a, b,  k[7], 1735328473);
        b = gg20(b, c, d, a, k[12], -1926607734);

        a =  hh4(a, b, c, d,  k[5], -378558);
        d = hh11(d, a, b, c,  k[8], -2022574463);
        c = hh16(c, d, a, b, k[11], 1839030562);
        b = hh23(b, c, d, a, k[14], -35309556);
        a =  hh4(a, b, c, d,  k[1], -1530992060);
        d = hh11(d, a, b, c,  k[4], 1272893353);
        c = hh16(c, d, a, b,  k[7], -155497632);
        b = hh23(b, c, d, a, k[10], -1094730640);
        a =  hh4(a, b, c, d, k[13], 681279174);
        d = hh11(d, a, b, c,  k[0], -358537222);
        c = hh16(c, d, a, b,  k[3], -722521979);
        b = hh23(b, c, d, a,  k[6], 76029189);
        a =  hh4(a, b, c, d,  k[9], -640364487);
        d = hh11(d, a, b, c, k[12], -421815835);
        c = hh16(c, d, a, b, k[15], 530742520);
        b = hh23(b, c, d, a,  k[2], -995338651);

        a =  ii6(a, b, c, d,  k[0], -198630844);
        d = ii10(d, a, b, c,  k[7], 1126891415);
        c = ii15(c, d, a, b, k[14], -1416354905);
        b = ii21(b, c, d, a,  k[5], -57434055);
        a =  ii6(a, b, c, d, k[12], 1700485571);
        d = ii10(d, a, b, c,  k[3], -1894986606);
        c = ii15(c, d, a, b, k[10], -1051523);
        b = ii21(b, c, d, a,  k[1], -2054922799);
        a =  ii6(a, b, c, d,  k[8], 1873313359);
        d = ii10(d, a, b, c, k[15], -30611744);
        c = ii15(c, d, a, b,  k[6], -1560198380);
        b = ii21(b, c, d, a, k[13], 1309151649);
        a =  ii6(a, b, c, d,  k[4], -145523070);
        d = ii10(d, a, b, c, k[11], -1120210379);
        c = ii15(c, d, a, b,  k[2], 718787259);
        b = ii21(b, c, d, a,  k[9], -343485551);

        x[0] = (a + x[0]) | 0;
        x[1] = (b + x[1]) | 0;
        x[2] = (c + x[2]) | 0;
        x[3] = (d + x[3]) | 0;
    };

    var hexChars = '0123456789abcdef';
    var hexOut = [];

    var hex = function(x) {
        var hc = hexChars;
        var ho = hexOut;
        var n, offset, j;
        for (var i = 0; i < 4; i++) {
            offset = i * 8;
            n = x[i];
            for ( j = 0; j < 8; j += 2 ) {
                ho[offset+1+j] = hc.charAt(n & 0x0F);
                n >>>= 4;
                ho[offset+0+j] = hc.charAt(n & 0x0F);
                n >>>= 4;
            }
        }
        return ho.join('');
    };

    var MD5 = function() {
        this._dataLength = 0;
        this._state = new Int32Array(4);
        this._buffer = new ArrayBuffer(68);
        this._bufferLength = 0;
        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
        this.start();
    };

    var stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
    var buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // Char to code point to to array conversion:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt#Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    MD5.prototype.appendStr = function(str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var code;
        for ( var i = 0; i < str.length; i++ ) {
            code = str.charCodeAt(i);
            if ( code < 128 ) {
                buf8[bufLen++] = code;
            } else if ( code < 0x800 ) {
                buf8[bufLen++] = (code >>> 6) + 0xC0;
                buf8[bufLen++] = code & 0x3F | 0x80;
            } else if ( code < 0xD800 || code > 0xDBFF ) {
                buf8[bufLen++] = (code >>> 12) + 0xE0;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            } else {
                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                if ( code > 0x10FFFF ) {
                    throw 'Unicode standard supports code points up to U+10FFFF';
                }
                buf8[bufLen++] = (code >>> 18) + 0xF0;
                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            if ( bufLen >= 64 ) {
                this._dataLength += 64;
                md5cycle(this._state, buf32);
                bufLen -= 64;
                buf32[0] = buf32[16];
            }
        }
        this._bufferLength = bufLen;
        return this;
    };

    MD5.prototype.appendAsciiStr = function(str) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i, j = 0;
        for (;;) {
            i = Math.min(str.length-j, 64-bufLen);
            while ( i-- ) {
                buf8[bufLen++] = str.charCodeAt(j++);
            }
            if ( bufLen < 64 ) {
                break;
            }
            this._dataLength += 64;
            md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };

    MD5.prototype.appendByteArray = function(input) {
        var buf8 = this._buffer8;
        var buf32 = this._buffer32;
        var bufLen = this._bufferLength;
        var i, j = 0;
        for (;;) {
            i = Math.min(input.length-j, 64-bufLen);
            while ( i-- ) {
                buf8[bufLen++] = input[j++];
            }
            if ( bufLen < 64 ) {
                break;
            }
            this._dataLength += 64;
            md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    };

    MD5.prototype.start = function() {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state.set(stateIdentity);
        return this;
    };

    MD5.prototype.end = function(raw) {
        var bufLen = this._bufferLength;
        this._dataLength += bufLen;
        var buf8 = this._buffer8;
        buf8[bufLen] = 0x80;
        buf8[bufLen+1] =  buf8[bufLen+2] =  buf8[bufLen+3] = 0;
        var buf32 = this._buffer32;
        var i = (bufLen >> 2) + 1;
        buf32.set(buffer32Identity.subarray(i), i);
        if (bufLen > 55) {
            md5cycle(this._state, buf32);
            buf32.set(buffer32Identity);
        }
        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        var dataBitsLen = this._dataLength * 8;
        if ( dataBitsLen <= 0xFFFFFFFF ) {
            buf32[14] = dataBitsLen;
        } else {
            var matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
            var lo = parseInt(matches[2], 16);
            var hi = parseInt(matches[1], 16) || 0;
            buf32[14] = lo;
            buf32[15] = hi;
        }
        md5cycle(this._state, buf32);

        return !!raw ? this._state : hex(this._state);
    };

    // This permanent instance is to use for one-call hashing
    var onePassHasher = new MD5();

    MD5.hashStr = function(str, raw) {
        return onePassHasher
            .start()
            .appendStr(str)
            .end(raw);
    };

    MD5.hashAsciiStr = function(str, raw) {
        return onePassHasher
            .start()
            .appendAsciiStr(str)
            .end(raw);
    };

    // Self-test
    // In some cases the fast add32 function cannot be used..
    if ( MD5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592' ) {
        console.error('YaMD5> this javascript engine does not support YaMD5. Sorry.');
    }

    if ( typeof root === 'object' ) {
        root.YaMD5 = MD5;
    }
    return MD5;
})(this);

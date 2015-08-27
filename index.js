// Copyright Marcel Bankmann <marcel.bankmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var through = require('through');

/**
* Simple reservoir sampling implementation according to "algorithm R" as described here:
* https://en.wikipedia.org/wiki/Reservoir_sampling#Algorithm_R
*
* The algorithm will create a representative stream sample with every new data from the stream
* with a very low memory footprint regardless of the streams length.
*
* To achieve this, every new piece of data will replace another piece of the stream sample with decreasing odds.
*
* @class StreamReservoirSampler
* @param {Integer} sampleCount The length of the stream sample that will be created.
*/
function StreamReservoirSampler(sampleLength) {
    var sample = new Array(sampleLength),
        i = 0;
        return through(function write(data) {
        if (i < sampleLength) {
            sample[i] = data;
        } else {
            var randomIndex = Math.round(Math.random() * i);
            if (randomIndex < sampleLength) {
                sample[randomIndex] = data;
            }
        }
        i++;
        this.push(sample);
    });
}

module.exports = StreamReservoirSampler;


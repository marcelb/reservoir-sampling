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

var assert = require("assert");
var random = require("node-random");

StreamReservoirSampler = require('../');

describe('streamReservoirSampler', function() {
    describe('sample size equals stream size', function() {
        var sampler = StreamReservoirSampler(6);
        sampler.write('T');
        sampler.write('H');
        sampler.write('E');
        sampler.write('F');
        sampler.write('O');

        sampler.on('data', function(sample) {
            it('result should equal to THEFOX', function () {
                assert.equal(sample.length, 6);
                assert.deepEqual(sample, ['T', 'H', 'E', 'F', 'O', 'X']);
            });
        });
        
        sampler.write('X');
    });

    describe('sample from many values', function() {
        var sampler = StreamReservoirSampler(10);
        for (var i = 0; i < 10000; i++) {
            sampler.write(Math.round(Math.random() * 100));
        }

        sampler.on('data', function(sample) {
            it('all values of the result should be within the range of 0 to 99', function () {
                assert.equal(sample.length, 10);
                sample.forEach(function(s) {
                  assert.ok(s > 0);
                  assert.ok(s <= 100);
                });
            });
        });
        sampler.write(50);
    });


    describe('sample from random.org values', function() {
        
        var randomData = 'empty';

        it('get values from random.org', function (done) {
            random.strings({
                "length": 1,
                "number": 200,
                "upper": true,
                "digits": true
            },  function(error, data) {
                if (error) throw error;
                randomData = data;
                done();
            });    
        });

        it('all values of the result should be alphanumeric', function (done) {
            var sampler = StreamReservoirSampler(20);
            for (var i = 0; i < (randomData.length-1); i++) {
                sampler.write(randomData[i]);
            }

            sampler.on('data', function(sample) {
                assert.equal(sample.length, 20);
                assert.ok(/^[A-Z0-9]+$/i.test(sample.join('')));
                done();
            });
            sampler.write(randomData[randomData.length-1]);
        });
        
    });
});
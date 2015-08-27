Reservoir Sampling Implementation
===

### To build:

Unix/Macintosh:

```sh
npm install
make
```

### What is this?
Simple reservoir sampling implementation according to "algorithm R" as described here:
https://en.wikipedia.org/wiki/Reservoir_sampling#Algorithm_R

The algorithm will create a representative stream sample with every new data from the stream
with a very low memory footprint regardless of the streams length.

To achieve this, every new piece of data will replace another piece of the stream sample with decreasing odds.
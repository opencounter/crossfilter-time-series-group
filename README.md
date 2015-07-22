# Crossfilter-Time-Series-Group

TimeSeriesGroup is designed to be used with Square’s [Crossfilter](https://square.github.io/crossfilter/) library, a highly performant tool for filtering and sorting across multiple dimensions of a dataset. It works just as you’d use a normal Crossfilter group, but ensures that the `all()` method always returns a continuous series of time-series buckets.


## Usage

TimeSeriesGroup can be loaded via CommonJS (for Node or Browserify), ES6 import, AMD (for Require.js), or as a simple browser global:

```javascript
// ES6
import TimeSeriesGroup from "crossfilter-time-series-group";
// CommonJS
var TimeSeriesGroup = require("crossfilter-time-series-group");
// Require.js
define(["crossfilter-time-series-group"], function(TimeSeriesGroup) {
  // your code
});
// Global
crossfilterTimeSeriesGroup;
```

You create a `TimeSeriesGroup` from a normal crossfilter group. You must also supply a time interval (e.g. hours, days, years). An optional third argument allows you to specify what value to use for missing points in the series (the default is `0`).

```javascript
var data = crossfilter([
  {id: 1, date: new Date("2015-03-02")},
  {id: 2, date: new Date("2015-03-05")}
  // and so on...
]);
var date = data.dimension(function(d) { return d.date; });
var dates = TimeSeriesGroup(date.group(), 24 * 60 * 60 * 1000);
```

The interval can be a number of milliseconds or a D3 interval object (or any object with an `offset(date, step)` method). Using an interval object can give you clearer code and allow you to handle all the wonderful inconsistencies in time:

```javascript
var dates = TimeSeriesGroup(date.group(), d3.time.day);
```


## Why?

You might have data like:

```javascript
var data = crossfilter([
  {id: 1, date: new Date("2015-03-02")},
  {id: 2, date: new Date("2015-03-02")},
  {id: 3, date: new Date("2015-03-03")},
  {id: 4, date: new Date("2015-03-06")},
  {id: 5, date: new Date("2015-03-06")}
]);
var date = data.dimension(function(d) { return d.date; });
var dates = date.group();
```

Calling `dates.all()` would yield:

```javascript
[{key: "2015-03-02", value: 2},
{key: "2015-03-03", value: 1},
{key: "2015-03-06", value: 2}]
```

The results don’t include counts for 2015-03-04 and 2015-03-05 because there were no records with those dates. That’s perfectly accurate and causes no problem in many cases, but in others it might be a real issue. For example, a common technique for making a line chart is to make a line from each point in a series. However, if there are holes in the series, as above, the line would indicate a value of `2` instead of `0` for the missing days.

```javascript
var dates = TimeSeriesGroup(date.group(), 24 * 60 * 60 * 1000);
dates.all();
// result:
// [{key: "2015-03-02", value: 2},
// {key: "2015-03-03", value: 1},
// {key: "2015-03-04", value: 0},
// {key: "2015-03-05", value: 0},
// {key: "2015-03-06", value: 2}]
```

With D3, the above can be even simpler:

```javascript
var dates = TimeSeriesGroup(date.group(), d3.time.day);
```

## Copyright

Copyright (c) 2015 Open Counter Enterprises, Inc. and made freely available under the MIT license. See [LICENSE][] for details.

[license]: https://github.com/opencounter/crossfilter-time-series-group/blob/master/LICENSE

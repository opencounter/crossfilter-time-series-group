/*!
 * crossfilter-time-series-group v0.5.0
 * Copyright (c) 2015 Open Counter Enterprises, Inc.
 * This software is free to use under the MIT license.
 * See https://github.com/opencounter/crossfilter-time-series-group/blob/master/LICENSE
 */
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.crossfilterTimeSeriesGroup = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  (function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define(["exports", "module"], factory);
    } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
      factory(exports, module);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports, mod);
      global.crossfilterTimeSeriesGroup = mod.exports;
    }
  })(undefined, function (exports, module) {
    /**
     * A special type of crossfilter group that can be used as a time series.
     *
     * When grouping by dates/times in crossfilter, you'll wind up with no groups
     * if there isn't any data in a given time bucket. Sometimes this is fine, but
     * other times, it's not. For example, creating a line from point to point
     * based on groups would be incorrect -- it would show the wrong value for time
     * buckets where there was no data (instead it would show no change from the
     * last bucket where there was data). This ensures that getting all groups
     * returns a group *for every bucket in the time series.*
     *
     * @param {CrossfilterGroup} group     The group to transform into a time-
     *                                     series group.
     * @param {D3Interval|Number} interval The time-series bucket size.
     * @param {Object} defaultValue        (Optional) the value to use for empty
     *                                     time-series buckets.
     */
    "use strict";

    module.exports = TimeSeriesGroup;

    function TimeSeriesGroup(group, interval, defaultValue) {
      defaultValue = defaultValue || 0;
      var next = interval.offset ? function (current) {
        return interval.offset(current, 1);
      } : function (current) {
        return current + interval;
      };

      var _all = group.all;
      group.all = function () {
        var items = _all.apply(this, arguments);

        if (!items.length) {
          return [];
        }

        var results = [items[0]];

        var bucket = items[0].key.getTime();
        for (var i = 1, len = items.length; i < len; i++) {
          bucket = next(bucket);
          var itemTime = items[i].key.getTime();
          while (bucket < itemTime) {
            results.push({ key: new Date(bucket), value: defaultValue });
            bucket = next(bucket);
          }
          results.push(items[i]);
        }

        return results;
      };

      return group;
    }
  });
});

/*!
 * crossfilter-time-series-group v0.5.0
 * Copyright (c) 2015 Open Counter Enterprises, Inc.
 * This software is free to use under the MIT license.
 * See https://github.com/opencounter/crossfilter-time-series-group/blob/master/LICENSE
 */

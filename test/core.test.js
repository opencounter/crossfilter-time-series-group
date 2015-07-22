import {expect} from "chai";
import crossfilter from "crossfilter";
import d3 from "d3";
import TimeSeriesGroup from "../crossfilter-time-series-group";

describe("Core tests", function() {
  it("should return a continuous time series for all()", function() {
    var data = crossfilter([
      {id: 1, date: new Date("2015-03-02")},
      {id: 2, date: new Date("2015-03-02")},
      {id: 3, date: new Date("2015-03-03")},
      {id: 4, date: new Date("2015-03-06")},
      {id: 5, date: new Date("2015-03-06")}
    ]);
    var date = data.dimension(function(d) { return d.date; });
    var dates = TimeSeriesGroup(date.group(), 24 * 60 * 60 * 1000);

    expect(dates.all()).to.deep.equal([
      {key: new Date("2015-03-02"), value: 2},
      {key: new Date("2015-03-03"), value: 1},
      {key: new Date("2015-03-04"), value: 0},
      {key: new Date("2015-03-05"), value: 0},
      {key: new Date("2015-03-06"), value: 2}
    ]);
  });

  it("should work with D3 intervals", function() {
    var data = crossfilter([
      {id: 1, date: new Date("2015-03-02")},
      {id: 2, date: new Date("2015-03-02")},
      {id: 3, date: new Date("2015-03-03")},
      {id: 4, date: new Date("2015-03-06")},
      {id: 5, date: new Date("2015-03-06")}
    ]);
    var date = data.dimension(function(d) { return d.date; });
    var dates = TimeSeriesGroup(date.group(), d3.time.day);

    expect(dates.all()).to.deep.equal([
      {key: new Date("2015-03-02"), value: 2},
      {key: new Date("2015-03-03"), value: 1},
      {key: new Date("2015-03-04"), value: 0},
      {key: new Date("2015-03-05"), value: 0},
      {key: new Date("2015-03-06"), value: 2}
    ]);
  });

  it("should take alternate initial values", function() {
    var data = crossfilter([
      {id: 1, date: new Date("2015-03-02")},
      {id: 2, date: new Date("2015-03-02")},
      {id: 3, date: new Date("2015-03-03")},
      {id: 4, date: new Date("2015-03-06")},
      {id: 5, date: new Date("2015-03-06")}
    ]);
    var date = data.dimension(function(d) { return d.date; });
    var dates = TimeSeriesGroup(date.group(), d3.time.day, -5);

    expect(dates.all()).to.deep.equal([
      {key: new Date("2015-03-02"), value: 2},
      {key: new Date("2015-03-03"), value: 1},
      {key: new Date("2015-03-04"), value: -5},
      {key: new Date("2015-03-05"), value: -5},
      {key: new Date("2015-03-06"), value: 2}
    ]);
  });
});

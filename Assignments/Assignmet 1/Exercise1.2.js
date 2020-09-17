class DateInterval {
  constructor(from, to) {
    //required input date format: "yyyy-mm-dd"
    //create proper format
    from = from + "T00:00:00.000Z";
    to = to + "T00:00:00.000Z";
    //create date objects
    this.dateFrom = new Date(from);
    this.dateTo = new Date(to);
  }
  from() {
    //convert to more readable format before returning
    return this.dateFrom.toDateString();
  }
  to() {
    //convert to more readable format before returning
    return this.dateTo.toDateString();
  }
  contains(d) {
    return this.dateFrom < d && d < this.dateTo;
  }
}

//DataType class
function DataType(type, unit) {
  this.typeValue = type;
  this.unitValue = unit;
  DataType.prototype = {
    type: function () {
      return this.typeValue;
    },
    unit: function () {
      return this.unitValue;
    },
  };
}

//Event class
function Event(time, place) {
  //required input time format: "yyyy-mm-ddThh:mm:ss"
  time = time + ".000Z";
  this.timeValue = new Date(time);
  this.placeValue = place;
  Event.prototype = {
    time: function () {
      return this.timeValue;
    },
    place: function () {
      return this.placeValue;
    },
  };
}

class WeatherForecast {
  constructor(data) {
    this.weatherPredictionData = data;
    this.currentPlace = null;
    this.currentType = null;
    this.currentPeriod = null;
  }
  getCurrentPlace() {
    return this.currentPlace;
  }
  setCurrentPlace(place) {
    this.currentPlace = place;
  }
  clearCurrentPlace() {
    this.currentPlace = null;
  }
  getCurrentType() {
    return this.currentType;
  }
  setCurrentType(type) {
    this.currentType = type;
  }
  clearCurrentType() {
    this.currentType = null;
  }
  getCurrentPeriod() {
    return this.currentPeriod;
  }
  setCurrentPeriod(period) {
    this.currentPeriod = period;
  }
  clearCurrentPeriod() {
    this.currentPeriod = null;
  }
  convertToUSUnits() {
    this.weatherPredictionData.forEach((element) => {
      if (element.unit() == "International") {
        if (element instanceof WindPrediction) {
          element.convertToMPH();
        } else if (element instanceof PrecipitationPrediction) {
          element.convertToInches();
        } else if (element instanceof TemperaturePrediction) {
          element.convertToF();
        }
      }
    });
  }
  convertToInternationalUnits() {
    this.weatherPredictionData.forEach((element) => {
      if (element.unit() == "US") {
        if (element instanceof WindPrediction) {
          element.convertToMS();
        } else if (element instanceof PrecipitationPrediction) {
          element.convertToMM();
        } else if (element instanceof TemperaturePrediction) {
          element.convertToC();
        }
      }
    });
  }
  add(data) {
    this.weatherPredictionData.concat(data);
  }
  checkCurrentPlaceFilter(data) {
    if (this.currentPlace != null) {
      let filteredData = [];
      data.forEach((element) => {
        if (element.place() == this.currentPlace) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }
  checkForCurrentTypeFilter(data) {
    if (this.currentType != null) {
      let filteredData = [];
      data.forEach((element) => {
        if (element.type() == this.currentType) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }
  checkForCurrentPeriodFilter(data) {
    if (this.currentPeriod != null) {
      let filteredData = [];
      data.forEach((element) => {
        if (this.currentPeriod.contains(element.time())) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }
  data() {
    let filterData = this.weatherPredictionData;
    filterData = this.checkCurrentPlaceFilter(filterData);
    filterData = this.checkForCurrentTypeFilter(filterData);
    filterData = this.checkForCurrentPeriodFilter(filterData);
    return filterData;
  }
}

function WeatherPrediction(time, place, type, unit, numberTo, numberFrom) {
  Event.call(this, time, place);
  DataType.call(this, type, unit);
  this.numberTo = numberTo;
  this.numberFrom = numberFrom;
}
//mix Event prototype with DataType prototype
WeatherPrediction.prototype = Object.create(Event.prototype);
Object.assign(WeatherPrediction.prototype, DataType.prototype);
//add  function to WeatherData prototype
WeatherPrediction.prototype.matches = function (data) {
  if (data.value() < this.to() && data.value() > this.from()) {
    return true;
  } else {
    return false;
  }
};
WeatherPrediction.prototype.to = function () {
  return this.numberTo;
};
WeatherPrediction.prototype.from = function () {
  return this.numberFrom;
};

//WeatherData class
function WeatherData(time, place, type, unit, value) {
  Event.call(this, time, place);
  DataType.call(this, type, unit);
  this.weatherDataValue = value;
}

//mix Event prototype with DataType prototype
WeatherData.prototype = Object.create(Event.prototype);
Object.assign(WeatherData.prototype, DataType.prototype);
//add value function to WeatherData prototype
WeatherData.prototype.value = function () {
  return this.weatherDataValue;
};

class WeatherHistory {
  constructor(data) {
    this.weatherData = data;
    this.currentPlace = null;
    this.currentType = null;
    this.currentPeriod = null;
  }

  getCurrentPlace() {
    return this.currentPlace;
  }
  setCurrentPlace(place) {
    this.currentPlace = place;
  }
  clearCurrentPlace() {
    this.currentPlace = null;
  }
  getCurrentType() {
    return this.currentType;
  }
  setCurrentType(type) {
    this.currentType = type;
  }
  clearCurrentType() {
    this.currentType = null;
  }
  getCurrentPeriod() {
    return this.currentPeriod;
  }
  setCurrentPeriod(period) {
    this.currentPeriod = period;
  }
  clearCurrentPeriod() {
    this.currentPeriod = null;
  }
  convertToUSUnits() {
    this.weatherData.forEach((element) => {
      if (element.unit() == "International") {
        if (element instanceof Wind) {
          element.convertToMPH();
        } else if (element instanceof Precipitation) {
          element.convertToInches();
        } else if (element instanceof Temperature) {
          element.convertToF();
        }
      }
    });
  }
  convertToInternationalUnits() {
    this.weatherData.forEach((element) => {
      if (element.unit() == "US") {
        if (element instanceof Wind) {
          element.convertToMS();
        } else if (element instanceof Precipitation) {
          element.convertToMM();
        } else if (element instanceof Temperature) {
          element.convertToC();
        }
      }
    });
  }
  add(data) {
    this.weatherData.concat(data);
  }
  checkCurrentPlaceFilter(data) {
    if (this.currentPlace != null) {
      let filteredData = [];
      data.forEach((element) => {
        if (element.place() == this.currentPlace) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }
  checkForCurrentTypeFilter(data) {
    if (this.currentType != null) {
      let filteredData = [];
      data.forEach((element) => {
        if (element.type() == this.currentType) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }
  checkForCurrentPeriodFilter(data) {
    if (this.currentPeriod != null) {
      let filteredData = [];
      data.forEach((element) => {
        if (this.currentPeriod.contains(element.time())) {
          filteredData.push(element);
        }
      });
      return filteredData;
    } else {
      return data;
    }
  }
  data() {
    let filterData = this.weatherData;
    filterData = this.checkCurrentPlaceFilter(filterData);
    filterData = this.checkForCurrentTypeFilter(filterData);
    filterData = this.checkForCurrentPeriodFilter(filterData);
    return filterData;
  }
}

//CloudCoveragePrediciton class
function CloudCoveragePrediction(
  time,
  place,
  type,
  unit,
  numberTo,
  numberFrom
) {
  WeatherPrediction.call(this, time, place, type, unit, numberTo, numberFrom);
}

//WindPrediction class
function WindPrediction(
  time,
  place,
  type,
  unit,
  numberTo,
  numberFrom,
  directions
) {
  WeatherPrediction.call(this, time, place, type, unit, numberTo, numberFrom);
  this.directionsValue = directions;
}
WindPrediction.prototype = Object.create(WeatherPrediction.prototype);
WindPrediction.prototype.directions = function () {
  return this.directionsValue;
};
WindPrediction.prototype.matches = function (data) {
  console.log("wind prediciton matches");
  if (this.directionsValue.indexOf(data.direction()) > -1) {
    return true;
  } else {
    return false;
  }
};
WindPrediction.prototype.convertToMPH = function () {
  if (this.unit() == "International") {
    this.numberFrom /= 2237;
    this.numberTo /= 2237;
  }
};
WindPrediction.prototype.convertToMS = function () {
  if (this.unit() == "US") {
    this.numberFrom *= 2237;
    this.numberTo *= 2237;
  }
};

//PrecipitationPrediction class
function PrecipitationPrediction(
  time,
  place,
  type,
  unit,
  numberTo,
  numberFrom,
  types
) {
  WeatherPrediction.call(this, time, place, type, unit, numberTo, numberFrom);
  this.typesValue = types;
}
PrecipitationPrediction.prototype = Object.create(WeatherPrediction.prototype);
PrecipitationPrediction.prototype.types = function () {
  return this.types;
};
PrecipitationPrediction.prototype.matches = function (data) {
  if (this.typesValue.indexOf(data.precipitationType()) > -1) {
    return true;
  } else {
    return false;
  }
};
PrecipitationPrediction.prototype.convertToInches = function () {
  if (this.unit() == "International") {
    this.numberFrom /= 25.4;
    this.numberTo /= 25.4;
  }
};
PrecipitationPrediction.prototype.convertToMM = function () {
  if (this.unit() == "US") {
    this.numberFrom *= 25.4;
    this.numberTo *= 25.4;
  }
};

//TemperaturePrediction class
function TemperaturePrediction(time, place, type, unit, numberTo, numberFrom) {
  WeatherPrediction.call(this, time, place, type, unit, numberTo, numberFrom);
}
TemperaturePrediction.prototype = Object.create(WeatherPrediction.prototype);
TemperaturePrediction.prototype.convertToF = function () {
  if (this.unit() == "International") {
    this.numberFrom = (this.numberFrom * 9) / 5 + 32;
    this.numberTo = (this.numberTo * 9) / 5 + 32;
  }
};
TemperaturePrediction.prototype.convertToC = function () {
  if (this.unit() == "US") {
    this.numberFrom = ((this.numberFrom - 32) * 5) / 9;
    this.numberTo *= ((this.numberTo - 32) * 5) / 9;
  }
};

//CloudCoverage class
function CloudCoverage(time, time, place, type, unit, value) {
  WeatherData.call(this, time, place, type, unit, value);
}
CloudCoverage.prototype = Object.create(WeatherData.prototype);

//Wind class
function Wind(time, place, type, unit, value, direction) {
  WeatherData.call(this, time, place, type, unit, value);
  this.directionValue = direction;
}
Wind.prototype = Object.create(WeatherData.prototype);
Wind.prototype.direction = function () {
  return this.directionValue;
};
Wind.prototype.convertToMPH = function () {
  if (this.unit() == "International") {
    this.weatherDataValue *= 2237;
  }
};
Wind.prototype.convertToMS = function () {
  if (this.unit() == "US") {
    this.weatherDataValue /= 2237;
  }
};

//Precipitation class
function Precipitation(time, place, type, unit, value, precipitationType) {
  WeatherData.call(this, time, place, type, unit, value);
  this.precipitationTypeValue = precipitationType;
}
Precipitation.prototype = Object.create(WeatherData.prototype);
Precipitation.prototype.precipitationType = function () {
  return this.precipitationTypeValue;
};
Precipitation.prototype.convertToInches = function () {
  if (this.unit() == "International") {
    this.value /= 25.4;
  }
};
Precipitation.prototype.convertToMM = function () {
  if (this.unit() == "US") {
    this.value *= 25.4;
  }
};

//Temperature class
function Temperature(time, place, type, unit, value) {
  WeatherData.call(this, time, place, type, unit, value);
}
Temperature.prototype = Object.create(WeatherData.prototype);
Temperature.prototype.convertToF = function () {
  if (this.unit() == "International") {
    this.value = (this.value * 9) / 5 + 32;
  }
};
Temperature.prototype.convertToC = function () {
  if (this.unit() == "US") {
    this.value = ((this.value - 32) * 5) / 9;
  }
};

let weatherData = [
  new Temperature("2000-01-01T02:00:00", "Horsens", "type1", "US", 200),
  new Temperature("2000-01-02T02:00:00", "Vejle", "type2", "US", 150),
  new Precipitation(
    "2000-01-03T02:00:00",
    "Arhus",
    "type3",
    "US",
    500,
    "precipitationType1"
  ),
  new Precipitation(
    "2000-01-04T02:00:00",
    "Alborg",
    "type4",
    "US",
    600,
    "precipitationType2"
  ),
  new Wind("2000-01-05T02:00:00", "Kolding", "type5", "US", 300, "East"),
  new Wind("2000-01-06T02:00:00", "Billund", "type6", "US", 350, "West"),
];
let weatherHistory = new WeatherHistory(weatherData);

let weatherPrediction = [
  new TemperaturePrediction(
    "2000-01-01T02:00:00",
    "Horsens",
    "type1",
    "US",
    1000,
    100
  ),
  new Temperature("2000-01-02T02:00:00", "Vejle", "type2", "US", 600, 300),
  new PrecipitationPrediction(
    "2000-01-03T02:00:00",
    "Arhus",
    "type3",
    "US",
    700,
    400,
    ["precipitationType1", "precipitationType5"]
  ),
  new PrecipitationPrediction(
    "2000-01-04T02:00:00",
    "Alborg",
    "type4",
    "US",
    800,
    400,
    ["precipitationType2", "precipitationType7"]
  ),
  new WindPrediction(
    "2000-01-05T02:00:00",
    "Kolding",
    "type5",
    "US",
    500,
    300,
    ["East", "South"]
  ),
  new WindPrediction(
    "2000-01-06T02:00:00",
    "Billund",
    "type6",
    "US",
    600,
    250,
    ["West", "North"]
  ),
];
let weatherForecast = new WeatherForecast(weatherPrediction);

console.log(weatherPrediction[0].to());

// predictionArray = [];
// predictionArray.push(
//   new WeatherPrediction("2000-01-01T02:00:00", "place1", "type1", "unit1", 5, 1)
// );
// predictionArray.push(
//   new WeatherPrediction("2010-01-02T02:00:00", "place2", "type2", "unit2", 5, 1)
// );
// predictionArray.push(
//   new WeatherPrediction("2000-01-03T02:00:00", "place3", "type3", "unit3", 5, 1)
// );
// predictionArray.push(
//   new WeatherPrediction("2000-01-04T02:00:00", "place4", "type4", "unit4", 5, 1)
// );
// test = new WeatherForecast(predictionArray);

// test.setCurrentPeriod(new DateInterval("1999-01-01", "2020-01-01"));
// console.log(test.getCurrentPeriod().contains(predictionArray[1].time()));

// a = new DateInterval("1990-01-01", "2020-01-01");
// console.log(predictionArray[1].time());
// console.log(a);
// console.log(a.contains(new Date("2010-01-02T00:00:00.000Z")));

// test.setCurrentPlace("place2");
// test.setCurrentType("type2");
// test.setCurrentPeriod(new DateInterval("2000-01-01", "2020-01-01"));
// console.log(predictionArray[1].time());
// test2 = new DateInterval("1999-01-01", "2020-01-01");
// console.log(test.getCurrentPeriod());
// console.log(test.data());
// console.log(test2.contains("2010-01-02"));

// arr = [
//   new WeatherPrediction(
//     "time",
//     "place",
//     "type",
//     "unit",
//     "numberTo",
//     "numbeFrom"
//   ),
//   new WeatherPrediction(
//     "time",
//     "place",
//     "type",
//     "unit",
//     "numberTo",
//     "numbeFrom"
//   ),
// ];

// test = new WeatherForecast(arr);
// console.log(test.getCurrentPlace());

// test = new Date(2020, 11, 17);
// console.log(test);

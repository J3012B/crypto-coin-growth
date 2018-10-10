const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"
const currentDate = new Date();

$(function() {

  loadPage();

});


function loadPage() {
  const bitcoinDateLbl = $("#bitcoin .date");
  const bitcoinYearLbl = $("#bitcoin .year");
  const bitcoinMonthLbl = $("#bitcoin .month");

  const ethDateLbl = $('#eth .date');
  const ethYearLbl = $('#eth .year');
  const ethMonthLbl = $('#eth .month');

  calculateCoinValueGrowthBetweenTwoDates('bitcoin', dateOneYearAgo(currentDate), currentDate, function(growth) {
    bitcoinYearLbl.text(growth + "%");
  });

  calculateCoinValueGrowthBetweenTwoDates('bitcoin', dateOneMonthAgo(currentDate), currentDate, function(growth) {
    bitcoinMonthLbl.text(growth + "%");
  });

  calculateCoinValueGrowthBetweenTwoDates('ethereum', dateOneYearAgo(currentDate), currentDate, function(growth) {
    ethYearLbl.text(growth + '%');
  });

  calculateCoinValueGrowthBetweenTwoDates('ethereum', dateOneMonthAgo(currentDate), currentDate, function(growth) {
    ethMonthLbl.text(growth + '%');
  });


  bitcoinDateLbl.text(currentDate);
  ethDateLbl.text(currentDate);
}

/*
  FETCH DATA ===================================================================
*/

// returns value growth of a given coin in a given range of two dates
function calculateCoinValueGrowthBetweenTwoDates(id, formerDate, laterDate, callback) {
  fetchCoinValue(id, laterDate, function (value) {
    const laterValue = value;
    console.log("Later value: " + laterValue);

    fetchCoinValue(id, formerDate, function(value) {
      const formerValue = value;
      console.log("Former value: " + formerValue);

      const growth = 100 * (laterValue - formerValue) / formerValue;

      callback(growth);
    });
  });
}

// returns the value of the coin in EUR at given date to the callback function
function fetchCoinValue(id, date, callback) {
  $.ajax({
    method: "GET",
    url: COINGECKO_API_URL + "/coins/" + id + "/history",
    data: {
      date: formatDate(date)
    }
  }).done(function (data) {
    const valueEUR = data.market_data.current_price.eur
    callback(valueEUR);
  }).fail(function () {
    console.warn("Could not retrieve coinGecko data");
  });
}

/*
  FORMAT DATE ==================================================================
*/

// returns date, but one year earlier than given date
function dateOneYearAgo(date) {
  var dateOneYearAgo = new Date(date);
  dateOneYearAgo.setFullYear(dateOneYearAgo.getFullYear() - 1);
  dateOneYearAgo = new Date(dateOneYearAgo);

  return dateOneYearAgo;
}

// returns date, but one month earlier than given date
function dateOneMonthAgo(date) {
  var dateOneMonthAgo = new Date(date);
  dateOneMonthAgo.setMonth(dateOneMonthAgo.getMonth() - 1);
  dateOneMonthAgo = new Date(dateOneMonthAgo);

  return dateOneMonthAgo;
}

// formats date to string with format 'dd-mm-yyyy'
function formatDate(date) {
  return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
}

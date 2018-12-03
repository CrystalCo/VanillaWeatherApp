// APIXU Info
const apiKey = '&APPID=6f2c26f2eea8cdaefefd94729d081acf';
const forecastUrl = 'http://api.openweathermap.org/data/2.5/';
const weatherIconUrl = 'http://openweathermap.org/img/w/'

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// AJAX functions
async function get5DayForecast() {
    const urlToFetch = forecastUrl + 'forecast?q=' + $input.val() + apiKey;

    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            let days = jsonResponse.list;
            return days;
        }
    } catch(error) {
        console.log(error);
    }
}

// Render functions
function kelvinToFahrenheit(kelvin) {
    fahren = 9 / 5 * (kelvin - 273) + 32;
    return Math.round(fahren * 10) / 10;
}

function renderForecast(days) {
    $weatherDivs.forEach(($day, index) => {
      const maxTempInF = kelvinToFahrenheit(days[index].main.temp_max);
      const minTempInF = kelvinToFahrenheit(days[index].main.temp_min);
      let weatherContent =
        '<h2> High: ' + maxTempInF + ' F </h2>' +
        '<h2> Low: ' + minTempInF + ' F </h2>' +
        '<img src="' + weatherIconUrl + days[index].weather[0].icon +
            '.png" class="weathericon" />' +
        '<h3>' + days[index].weather[0].description + '</h3>' +
        '<h2>' + weekDays[(new Date(days[index].dt)).getDay()] + '</h2>';
      $day.append(weatherContent);
    });
}

function executeSearch() {
    $weatherDivs.forEach(day => day.empty());
    $destination.empty();
    $container.css("visibility", "visible");
    get5DayForecast().then(forecast => renderForecast(forecast));
    return false;
}

$submit.click(executeSearch);

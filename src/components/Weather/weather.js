import $ from 'jquery';
import authHelpers from '../../helpers/authHelpers';
import weatherData from '../../helpers/Data/weatherData';

import './weather.scss';

const printWeatherDropdown = (weatherArray) => {
  let dropdown = `
    <div class="dropdown row mx-auto">
    <button class="btn btn-secondary dropdown-toggle mr-3" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Locations
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
  if (weatherArray.length) {
    weatherArray.forEach((location) => {
      dropdown += `<div class="dropdown-item get-location" id=${location.id}>${location.zipcode}</div>`;
    });
  } else {
    dropdown += '<div class="dropdown-item" >You Have No Locations</div>';
  }
  dropdown += '</div>';
  dropdown += '<div>';
  dropdown += '<button id="add-weather-btn" type="button" class="btn btn-success">+</button>';
  dropdown += '</div></div>';
  $('#weather-dropdown').html(dropdown);
};

const printWeather = (currentWeather) => {
  console.log(currentWeather.postal_code);
  const domstring = `
    <div class="row weather-card ">
      <div class="card col-6 mx-auto">
      <div class="card-header">Current Conditions</div>
      <div class="card-img-div">
        <img class="card-img-top img-fluid" src="https://www.weatherbit.io/static/img/icons/${currentWeather[0].weather.icon}.png" alt="weather icon">
      </div>  
        <div class="card-body">
          <h5 class="card-title">${currentWeather[0].city_name}, ${currentWeather[0].state_code}</h5>
          <p class="card-text">${currentWeather[0].temp}&degF</p>
          <p class="card-text">${currentWeather[0].weather.description}</p>
        </div>
        <div class="col-md-1 d-flex justify-content-center">
          <button type="button" class="delete-weather-btn btn btn-danger btn-sm mb-2">
            <i class="far fa-trash-alt"></i></button>
        </div>
      </div>
    </div>
  `;
  $('#weather').html(domstring);
};

const printWeatherWarning = () => {
  const uid = authHelpers.getCurrentUid();
  weatherData.getWeatherData(uid)
    .then((weatherArray) => {
      const isTrueArray = [];
      weatherArray.forEach((weatherDataSet) => {
        if (weatherDataSet.isCurrent === true) {
          isTrueArray.push(weatherDataSet);
        }
        if (isTrueArray.length === 0) {
          $('#weather').html('');
          const domstring = `
          <div class="row">
            <div class="card col-8 mx-auto">
            <div class="card-header">Current Conditions</div>
              <div class="card-body">
                <h5 class="card-title">Please Select A Location For Weather!</h5>
              </div>
            </div>
          </div>          
          `;
          $('#weather-warning').html(domstring);
        }
      });
    });
};

// const weatherPage = () => {
//   const uid = authHelpers.getCurrentUid();
//   weatherData.getCurrentWeatherData(uid)
//     .then(weatherArray => weatherData.getCurrentWeather(weatherArray.zipcode))
//     .then((currentWeather) => {
//       if (currentWeather.length === 0) {
//         printWeatherWarning();
//       } else {
//         $('#weather-warning').html('');
//         printWeather(currentWeather);
//       }
//     })
//     .catch((error) => {
//       console.error('error in getting weather', error);
//     });
// };

const getBrowserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var point = new google.maps.LatLng(lat, long);
        new google.maps.Geocoder().geocode(
            {'latLng': point},
            function (res, status) {
                var zip = res[0].formatted_address.match(/,\s\w{2}\s(\d{5})/);
                $("#location").val(zip);
  }
};

const weatherPage = () => {
  const uid = authHelpers.getCurrentUid();
  weatherData.getCurrentWeatherData(uid)
    .then((weatherArray) => {
      if (weatherArray.length === 0) {
        getBrowserLocation();
      } else {
        weatherData.getCurrentWeather(weatherArray.zipcode)
          .then((currentWeather) => {
            if (currentWeather.length === 0) {
              printWeatherWarning();
            } else {
              $('#weather-warning').html('');
              printWeather(currentWeather);
            }
          })
          .catch((error) => {
            console.error('error in getting weather', error);
          });
      }
    });
};

const getLocationsForDropdown = () => {
  const uid = authHelpers.getCurrentUid();
  weatherData.getWeatherData(uid)
    .then((weatherArray) => {
      printWeatherDropdown(weatherArray);
    });
};

const initWeather = () => {
  $('#add-location').hide();
  printWeatherWarning();
  getLocationsForDropdown();
  weatherPage();
};

export default { initWeather };

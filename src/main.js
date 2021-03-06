import { getWeatherByCity } from "./apiService.js";
import { mapListToDOMElements } from "./DOMEvents.js";

class WeatherApp {
  constructor() {
    this.DOMElems = {};
    this.init();
  }

  init = () => {
    this.connectDOMElems();
    this.setupListeners();
  };

  connectDOMElems = () => {
    const listOfIds = Array.from(document.querySelectorAll("[id]")).map(
      (elem) => elem.id
    );
    this.DOMElems = mapListToDOMElements(listOfIds);
  };

  setupListeners = () => {
    this.DOMElems.searchInput.addEventListener("keydown", this.onSubmit);
    this.DOMElems.searchButton.addEventListener("click", this.onSubmit);
    this.DOMElems.returnToSearchBtn.addEventListener(
      "click",
      this.returnToSearch
    );
  };

  onSubmit = (e) => {
    if (e.type === "click" || e.key === "Enter") {
      this.animateViewChange();

      let query = this.DOMElems.searchInput.value;

      getWeatherByCity(query)
        .then((data) => {
          this.displayWeatherData(data);
          this.DOMElems.searchInput.style.borderColor = "#003b73";
          this.DOMElems.searchInput.value = "";
          this.DOMElems.weatherErrorInfo.textContent = "";
        })
        .catch(() => {
          this.DOMElems.weatherErrorInfo.textContent = "";
          this.animateViewChange();
          this.DOMElems.searchInput.style.borderColor = "rgb(187, 48, 48)";
          this.DOMElems.weatherErrorInfo.textContent =
            "City not found. Please correct your spelling.";
          this.DOMElems.searchInput.value = "";
        });
    }
  };

  animateViewChange = () => {
    if (
      this.DOMElems.mainContainer.style.opacity === "1" ||
      this.DOMElems.mainContainer.style.opacity === ""
    ) {
      this.DOMElems.mainContainer.style.opacity = "0";
    } else {
      this.DOMElems.mainContainer.style.opacity = "1";
    }
  };

  changeView = () => {
    if (this.DOMElems.weatherSearchView.style.display !== "none") {
      this.DOMElems.weatherSearchView.style.display = "none";
      this.DOMElems.weatherForecastView.style.display = "block";
    } else {
      this.DOMElems.weatherSearchView.style.display = "flex";
      this.DOMElems.weatherForecastView.style.display = "none";
    }
  };

  returnToSearch = () => {
    this.animateViewChange();

    setTimeout(() => {
      this.changeView();
      this.animateViewChange();
    }, 500);
  };

  forecastForTheNextDays = (data) => {
    Object.entries(this.DOMElems.forecastForTheWeek.children).forEach(
      (entry, index) => {
        index++;

        const weather = data.consolidated_weather[index];
        const [dayTitle, weatherIcon, tempInfo] = entry[1].children;
        const dayOfTheWeek = new Date(weather.applicable_date).toLocaleString(
          "en-us",
          {
            weekday: "long",
          }
        );
        const forecastIconSrc = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
        const maxTemp = Math.round(weather.max_temp);
        const minTemp = Math.round(weather.min_temp);

        dayTitle.textContent = dayOfTheWeek;
        weatherIcon.src = forecastIconSrc;
        weatherIcon.alt = weather.weather_state_name;
        tempInfo.textContent = `${maxTemp}??/${minTemp}??`;
      }
    );
  };

  displayWeatherData = (data) => {
    this.changeView();
    this.animateViewChange();

    const todayWeather = data.consolidated_weather[0];
    const currTemp = Math.round(todayWeather.the_temp);
    const weatherHumidity = Math.round(todayWeather.humidity);
    const weatherWindSpeed = Math.round(todayWeather.wind_speed);

    this.DOMElems.mainWeatherIcon.src = `https://www.metaweather.com/static/img/weather/${todayWeather.weather_state_abbr}.svg`;
    this.DOMElems.mainWeatherIcon.alt = todayWeather.weather_state_name;
    this.DOMElems.weatherCity.textContent = data.title;
    this.DOMElems.weatherName.textContent = todayWeather.weather_state_name;
    this.DOMElems.weatherCurrentTemp.textContent = `${currTemp}??C`;
    this.DOMElems.weatherWindSpeed.textContent = `${weatherWindSpeed}km/h`;
    this.DOMElems.weatherHumidity.textContent = `${weatherHumidity}%`;

    this.forecastForTheNextDays(data);
  };
}

document.addEventListener("DOMContentLoaded", new WeatherApp());

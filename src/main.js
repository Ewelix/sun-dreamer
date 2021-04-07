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
          this.DOMElems.searchInput.style.borderColor = "red";
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
      (item, index) => {
        index++;

        const weather = data.consolidated_weather;
        const dayOfTheWeek = new Date(
          weather[index].applicable_date
        ).toLocaleString("en-us", {
          weekday: "long",
        });
        const maxTemp = Math.round(weather[index].max_temp);
        const minTemp = Math.round(weather[index].min_temp);

        item[1].children[0].textContent = dayOfTheWeek;
        item[1].children[1].src = `https://www.metaweather.com/static/img/weather/${weather[index].weather_state_abbr}.svg`;
        item[1].children[1].alt = weather[index].weather_state_name;
        item[1].children[2].textContent = `${maxTemp}°/${minTemp}°`;
      }
    );
  };

  displayWeatherData = (data) => {
    this.changeView();
    this.animateViewChange();

    const todayWeather = data.consolidated_weather[0];
    this.DOMElems.weatherCity.textContent = data.title;
    this.DOMElems.weatherName.textContent = todayWeather.weather_state_name;

    const currTemp = Math.round(todayWeather.the_temp);
    const weatherHumidity = Math.round(todayWeather.humidity);
    const weatherWindSpeed = Math.round(todayWeather.wind_speed);

    this.DOMElems.weatherCurrentTemp.textContent = `${currTemp}°C`;
    this.DOMElems.weatherWindSpeed.textContent = `${weatherWindSpeed}km/h`;
    this.DOMElems.weatherHumidity.textContent = `${weatherHumidity}%`;

    this.forecastForTheNextDays(data);
  };
}

document.addEventListener("DOMContentLoaded", new WeatherApp());

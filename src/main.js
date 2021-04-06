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

    // Forecast for the next 5 days

    Object.entries(this.DOMElems.forecastForTheWeek.children).forEach(
      (item, index) => {
        index++;

        const weather = data.consolidated_weather;

        const dayOfTheWeek = new Date(
          weather[index].applicable_date
        ).toLocaleString("en-us", {
          weekday: "long",
        });

        item[1].textContent = `${dayOfTheWeek} ${Math.round(
          weather[index].the_temp
        )}°C`;
      }
    );
  };
}

document.addEventListener("DOMContentLoaded", new WeatherApp());

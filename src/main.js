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

      getWeatherByCity(query).then((data) => {
        this.displayWeatherData(data);
        console.log(data);
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

    const weather = data.consolidated_weather[0];
    this.DOMElems.weatherCity.textContent = data.title;
    this.DOMElems.weatherIcon.src = `https://www.metaweather.com/static/img/weather/${weather.weather_state_abbr}.svg`;
    this.DOMElems.weatherIcon.alt = weather.weather_state_name;

    const currTemp = weather.the_temp.toFixed(2);
    const maxTemp = weather.max_temp.toFixed(2);
    const minTemp = weather.min_temp.toFixed(2);

    this.DOMElems.weatherCurrentTemp.textContent = `Current temperature: ${currTemp}`;
    this.DOMElems.weatherMaxTemp.textContent = `Max temp ${maxTemp}`;
    this.DOMElems.weatherMinTemp.textContent = `Min temp ${minTemp}`;
  };
}

document.addEventListener("DOMContentLoaded", new WeatherApp());

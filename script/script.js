const input = document.querySelector('.to-input-city__input');
const btn = document.querySelector('.to-input-city__btn');
let lastCity;

localStorage.getItem('lastCity') && (lastCity = localStorage.getItem('lastCity'));

const getWeather = async function (city) {
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&id=524901&appid=9c651c087d06bd86290f4467421d0033`;
    const response = await fetch(url);
    const data = await response.json();
    buildWeatherCardList(data);
}

const buildWeatherCardList = data => {
    let sliderLeftButton;
    let sliderRightButton;
    const list = document.createElement('ul');
    list.classList.add('weather-card-list');

    if (document.querySelector('.slider-right-btn')) {
        document.querySelector('.slider-left-btn').remove();
        document.querySelector('.slider-right-btn').remove();
    }
    const root = document.querySelector('#root');
    const title = document.querySelector('.to-input-city__title');
    root.innerHTML = '';

    let listCity = document.createElement('h2');
    listCity.classList.add('to-input-city__title');
    if (data.cod == 200) {
        listCity.textContent = `${lastCity[0].toUpperCase()}${lastCity.slice(1).toLowerCase()}`;

        sliderLeftButton = document.createElement('div');
        sliderRightButton = document.createElement('div');
        sliderLeftButton.classList.add('slider-left-btn');
        sliderRightButton.classList.add('slider-right-btn');
        document.querySelector('.container').append(sliderLeftButton, sliderRightButton);

        data.list.length = 24;
        let createCardList = new Promise(resolve => {
            data.list.forEach(item => {
                list.append(buildWeatherCard(item));
            })
            resolve();
        });
        createCardList.then(() => setHandlerClick(sliderLeftButton, sliderRightButton, list));
    } else if (data.cod == 404) {
        listCity.textContent = 'Такой город не найден';
        listCity.classList.add('to-input-city__error');
    }
    title && title.replaceWith(listCity);
    document.querySelector('.to-input-city').append(listCity);
    root.append(list);
}

const buildWeatherCard = data => {
    const directions = {
        NE: {
            initialBorder: 22.5,
            finalBorder: 67.5,
            value: 'Северо-восток',
        },
        E: {
            initialBorder: 67.5,
            finalBorder: 112.5,
            value: 'Восток',
        },
        SE: {
            initialBorder: 112.5,
            finalBorder: 157.5,
            value: 'Юго-восток',
        },
        S: {
            initialBorder: 157.5,
            finalBorder: 202.5,
            value: 'Юг',
        },
        SW: {
            initialBorder: 202.5,
            finalBorder: 247.5,
            value: 'Юго-запад',
        },
        W: {
            initialBorder: 247.5,
            finalBorder: 292.5,
            value: 'Запад',
        },
        NW: {
            initialBorder: 292.5,
            finalBorder: 337.5,
            value: 'Северо-запад',
        },
    }

    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    const card = document.createElement('li');
    card.classList.add('weather-card');

    let dt_txt = data.dt_txt.split(' ');
    let date = dt_txt[0].split('-');
    let time = dt_txt[1];
    const cardDate = document.createElement('h3');
    cardDate.classList.add('weather-card__date');
    cardDate.dataset.size = 30;
    cardDate.textContent = `${date[2]} ${months[date[1] - 1]} ${date[0]}, ${time}`;

    const weatherIconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const cardWeather = document.createElement('img');
    cardWeather.classList.add('weather-card__weather-image');
    cardWeather.setAttribute('src', weatherIconURL);

    const cardTemp = document.createElement('ul');
    cardTemp.classList.add('weather-card__temp');
    const cardExactTemp = document.createElement('li');
    cardExactTemp.classList.add('weather-card__exact-temp');
    cardExactTemp.textContent = `${Math.round(data.main.temp)}°`;

    const cardFeelTemp = document.createElement('li');
    cardFeelTemp.classList.add('weather-card__feel-temp');
    cardFeelTemp.textContent = `ощущается как ${Math.round(data.main.feels_like)}°`;
    cardTemp.append(cardExactTemp, cardFeelTemp);

    const cardAttributes = document.createElement('ul');
    cardAttributes.classList.add('weather-card__weather-attributes');
    const cardWindSpeed = document.createElement('li');
    cardWindSpeed.classList.add('weather-card__wind-speed');
    cardWindSpeed.textContent = `${data.wind.speed} м/c`;

    const cardHumidity = document.createElement('li');
    cardHumidity.classList.add('weather-card__humidity');
    cardHumidity.textContent = `${data.main.humidity}%`;

    const cardPressure = document.createElement('li');
    cardPressure.classList.add('weather-card__pressure');
    cardPressure.textContent = `${Math.round(data.main.pressure * 0.750147667)} мм`;
    cardAttributes.append(cardWindSpeed, cardHumidity, cardPressure);

    const cardWindDirection = document.createElement('p');
    cardWindDirection.classList.add('weather-card__wind-direction');
    let directionText;
    const directionDeg = data.wind.deg;
    for (let key in directions) {
        if (directionDeg >= directions[key].initialBorder && directionDeg <= directions[key].finalBorder) {
            directionText = directions[key].value;
        }
    }
    !directionText && (directionText = 'Север');
    cardWindDirection.textContent = `Направление ветра: ${directionText}`;

    card.append(cardDate, cardWeather, cardTemp, cardAttributes, cardWindDirection);

    return card;
}

lastCity && getWeather(lastCity);

btn.onclick = (event) => {
    event.preventDefault();
    if (input.value) {
        lastCity = input.value;
        localStorage.setItem('lastCity', lastCity);
        getWeather(lastCity);
    }
};

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityInput = document.querySelector('.search-box input');

weatherBox.style.display = 'none';
weatherDetails.style.display = 'none';

cityInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        search.click();
    }
});

search.addEventListener('click', () => {
    error404.style.display = 'none';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');
    
    search.style.backgroundColor = '#06283D';
    search.style.color = '#fff';
    search.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    
    const APIKey = '4f735698626e6f25ae92c09a3eb5f96a';
    const city = document.querySelector('.search-box input').value;
    
    if (city === '') {
        return;
    }

    let searchQuery = city;
    if (!city.toLowerCase().includes(',') && !city.toLowerCase().includes(' in')) {
        const commonIndianCities = [
            'mumbai', 'delhi', 'bangalore', 'kolkata', 'chennai', 'hyderabad', 'pune', 'ahmedabad', 
            'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 
            'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 
            'rajkot', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'allahabad', 
            'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 
            'raipur', 'kochi', 'chandigarh', 'mysore', 'guwahati', 'hubli', 'dharwad', 'salem', 
            'gurugram', 'noida', 'dehradun', 'shimla', 'panaji', 'gangtok', 'nainital', 'ooty', 'darjeeling'
        ];
        if (commonIndianCities.some(indianCity => city.toLowerCase().includes(indianCity))) {
            searchQuery = `${city},in`;
        }
    }
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${APIKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            
            if (json.cod === '404') {
                container.style.height = '400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.style.display = 'block';
                error404.style.opacity = '1';
                error404.style.scale = '1';
                return;
            }
            
            error404.style.display = 'none';
            error404.style.opacity = '0';
            error404.style.scale = '0';

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            
            let cityName = document.querySelector('.weather-box .city-name');
            if (!cityName) {
                cityName = document.createElement('p');
                cityName.className = 'city-name';
                weatherBox.insertBefore(cityName, temperature);
            }
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');
            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.svg';
                    break;
                    
                case 'Rain':
                case 'Drizzle':
                case 'Thunderstorm':
                    image.src = 'images/rain.svg';
                    break;
                    
                case 'Snow':
                    image.src = 'images/snow.svg';
                    break;
                    
                case 'Clouds':
                    image.src = 'images/cloud.svg';
                    break;
                    
                case 'Mist':
                case 'Haze':
                case 'Fog':
                case 'Smoke':
                case 'Dust':
                case 'Sand':
                case 'Ash':
                case 'Squall':
                case 'Tornado':
                    image.src = 'images/mist.svg';
                    break;
                    
                default:
                    image.src = 'images/cloud.svg';
            }
            
            cityName.innerHTML = `${json.name}, ${json.sys.country}`;
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            setTimeout(() => {
                weatherBox.style.display = 'block';
                weatherDetails.style.display = 'flex';
                weatherBox.style.opacity = '1';
                weatherBox.style.scale = '1';
                weatherDetails.style.opacity = '1';
                weatherDetails.style.scale = '1';
                image.style.display = 'inline';
                search.style.backgroundColor = '#dff6ff';
                search.style.color = '#06283D';
                search.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
            }, 300);
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
        })
        .catch(error => {
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            error404.style.display = 'block';
            error404.style.opacity = '1';
            error404.style.scale = '1';
            search.style.backgroundColor = '#dff6ff';
            search.style.color = '#06283D';
            search.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
        });
});
const themeToggle = document.getElementById('theme-switch');

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
});

// Toggle theme on switch change
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


  const container = document.querySelector('.container');
        const search = document.querySelector('.search-box button');
        const weatherBox = document.querySelector('.weather-box');
        const weatherDetails = document.querySelector('.weather-details');
        const error404 = document.querySelector('.not-found');
        const cityInput = document.querySelector('.search-box input');
        const loading = document.querySelector('.loading');
        const forecastContainer = document.querySelector('.forecast-container');
        const forecastCards = document.querySelector('.forecast-cards');
        const themeToggle = document.getElementById('theme-switch');

        // Initialize display states
        weatherBox.style.display = 'none';
        weatherDetails.style.display = 'none';
        error404.style.display = 'none';
        forecastContainer.style.display = 'none';

        // Enter key functionality
        cityInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                search.click();
            }
        });

        // Theme functionality
        window.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.checked = true;
            }
        });

        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Search functionality
        search.addEventListener('click', () => {
            error404.style.display = 'none';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            forecastContainer.style.display = 'none';
            
            // Show loading state
            loading.style.display = 'block';
            
            const APIKey = '4f735698626e6f25ae92c09a3eb5f96a';
            const city = document.querySelector('.search-box input').value;
            
            if (city === '') {
                loading.style.display = 'none';
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
            
            // Fetch current weather
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${APIKey}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(json => {
                    if (json.cod === '404') {
                        throw new Error('City not found');
                    }
                    
                    error404.style.display = 'none';
                    
                    // Update current weather
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
                    
                    // Set weather icon based on condition
                    switch (json.weather[0].main) {
                        case 'Clear':
                            image.src = 'https://openweathermap.org/img/wn/01d@2x.png';
                            break;
                        case 'Rain':
                        case 'Drizzle':
                        case 'Thunderstorm':
                            image.src = 'https://openweathermap.org/img/wn/09d@2x.png';
                            break;
                        case 'Snow':
                            image.src = 'https://openweathermap.org/img/wn/13d@2x.png';
                            break;
                        case 'Clouds':
                            image.src = 'https://openweathermap.org/img/wn/03d@2x.png';
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
                            image.src = 'https://openweathermap.org/img/wn/50d@2x.png';
                            break;
                        default:
                            image.src = 'https://openweathermap.org/img/wn/03d@2x.png';
                    }
                    
                    cityName.innerHTML = `${json.name}, ${json.sys.country}`;
                    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                    description.innerHTML = `${json.weather[0].description}`;
                    humidity.innerHTML = `${json.main.humidity}%`;
                    wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;
                    
                    // Fetch 5-day forecast
                    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchQuery}&units=metric&appid=${APIKey}`);
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Forecast not available');
                    }
                    return response.json();
                })
                .then(forecastData => {
                    // Process forecast data
                    processForecastData(forecastData);
                    
                    // Show all elements
                    loading.style.display = 'none';
                    weatherBox.style.display = 'block';
                    weatherDetails.style.display = 'flex';
                    forecastContainer.style.display = 'block';
                    
                    // Add animations
                    weatherBox.classList.add('active');
                    weatherDetails.classList.add('active');
                    forecastContainer.classList.add('active');
                })
                .catch(error => {
                    loading.style.display = 'none';
                    error404.style.display = 'block';
                    weatherBox.style.display = 'none';
                    weatherDetails.style.display = 'none';
                    forecastContainer.style.display = 'none';
                });
        });

        // Process 5-day forecast data
        function processForecastData(data) {
            forecastCards.innerHTML = '';
            
            // Get unique days (5 days)
            const dailyForecasts = {};
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                if (!dailyForecasts[day]) {
                    dailyForecasts[day] = item;
                }
            });
            
            // Create forecast cards
            for (const day in dailyForecasts) {
                if (dailyForecasts.hasOwnProperty(day)) {
                    const forecast = dailyForecasts[day];
                    const forecastCard = document.createElement('div');
                    forecastCard.className = 'forecast-card fade-in';
                    
                    // Get appropriate weather icon
                    let weatherIcon = '';
                    switch (forecast.weather[0].main) {
                        case 'Clear':
                            weatherIcon = 'https://openweathermap.org/img/wn/01d@2x.png';
                            break;
                        case 'Rain':
                        case 'Drizzle':
                        case 'Thunderstorm':
                            weatherIcon = 'https://openweathermap.org/img/wn/09d@2x.png';
                            break;
                        case 'Snow':
                            weatherIcon = 'https://openweathermap.org/img/wn/13d@2x.png';
                            break;
                        case 'Clouds':
                            weatherIcon = 'https://openweathermap.org/img/wn/03d@2x.png';
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
                            weatherIcon = 'https://openweathermap.org/img/wn/50d@2x.png';
                            break;
                        default:
                            weatherIcon = 'https://openweathermap.org/img/wn/03d@2x.png';
                    }
                    
                    forecastCard.innerHTML = `
                        <div class="day">${day}</div>
                        <img src="${weatherIcon}" alt="Weather Icon">
                        <div class="temp">${Math.round(forecast.main.temp)}°C</div>
                        <div class="desc">${forecast.weather[0].description}</div>
                    `;
                    
                    forecastCards.appendChild(forecastCard);
                }
            }
        }
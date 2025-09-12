    let currentTimezone = 'auto';
    let clockSound = 'none';
    let smoothSeconds = true;
    let alarms = [];
    let timerInterval = null;
    let timerTime = 0;
    let stopwatchInterval = null;
    let stopwatchTime = 0;
    let stopwatchRunning = false;
    let laps = [];
    let audioContext = null;
    let tickSound = null;

    // Initialize the clock
    function initClock() {
      // Load saved preferences
      loadPreferences();
      
      // Set up event listeners
      setupEventListeners();
      
      // Initialize audio context for sounds
      initAudio();
      
      // Start clock updates
      updateAnalogClock();
      setInterval(updateAnalogClock, 1000);
      
      // Check for alarms every minute
      setInterval(checkAlarms, 60000);
    }

    // Load saved preferences from local storage
    function loadPreferences() {
      const theme = localStorage.getItem('clockTheme') || 'classic';
      setTheme(theme);
      
      currentTimezone = localStorage.getItem('timezone') || 'auto';
      document.getElementById('timezoneSelect').value = currentTimezone;
      
      clockSound = localStorage.getItem('clockSound') || 'none';
      document.getElementById('soundSelect').value = clockSound;
      
      smoothSeconds = localStorage.getItem('smoothSeconds') !== 'false';
      document.getElementById('smoothSeconds').checked = smoothSeconds;
      
      const savedAlarms = localStorage.getItem('alarms');
      if (savedAlarms) {
        alarms = JSON.parse(savedAlarms);
        updateAlarmList();
      }
    }

    // Set up event listeners
    function setupEventListeners() {
      // Theme selector
      document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
          const theme = option.getAttribute('data-theme');
          setTheme(theme);
        });
      });
      
      // Settings tabs
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.getAttribute('data-tab');
          switchTab(tabName);
        });
      });
      
      // Timezone selector
      document.getElementById('timezoneSelect').addEventListener('change', (e) => {
        currentTimezone = e.target.value;
        localStorage.setItem('timezone', currentTimezone);
        updateAnalogClock();
      });
      
      // Sound selector
      document.getElementById('soundSelect').addEventListener('change', (e) => {
        clockSound = e.target.value;
        localStorage.setItem('clockSound', clockSound);
      });
      
      // Smooth seconds checkbox
      document.getElementById('smoothSeconds').addEventListener('change', (e) => {
        smoothSeconds = e.target.checked;
        localStorage.setItem('smoothSeconds', smoothSeconds);
      });
    }

    // Switch between settings tabs
    function switchTab(tabName) {
      // Update active tab
      document.querySelectorAll('.tab').forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      
      // Show active content
      document.querySelectorAll('.clock-mode').forEach(tabContent => {
        if (tabContent.id === tabName + 'Tab') {
          tabContent.classList.add('active');
        } else {
          tabContent.classList.remove('active');
        }
      });
    }

    // Set theme
    function setTheme(theme) {
      // Update active theme indicator
      document.querySelectorAll('.theme-option').forEach(option => {
        if (option.getAttribute('data-theme') === theme) {
          option.classList.add('active');
        } else {
          option.classList.remove('active');
        }
      });
      
      // Apply theme
      if (theme === 'dark') {
        document.body.classList.add('dark');
        document.body.style.backgroundImage = 'linear-gradient(120deg, #1a202c 0%, #2d3748 100%)';
      } else {
        document.body.classList.remove('dark');
        
        if (theme === 'classic') {
          document.body.style.backgroundImage = 'linear-gradient(120deg, #f7ecd2 0%, #e2c98f 100%)';
        } else if (theme === 'royal') {
          document.body.style.backgroundImage = 'linear-gradient(120deg, #1c3b69 0%, #8b4513 100%)';
        } else if (theme === 'modern') {
          document.body.style.backgroundImage = 'linear-gradient(120deg, #f0f0f0 0%, #c0c0c0 100%)';
        }
      }
      
      // Save preference
      localStorage.setItem('clockTheme', theme);
    }

    // Initialize audio context
    function initAudio() {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create tick sound
        tickSound = () => {
          if (clockSound === 'tick' && audioContext) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
          }
        };
      } catch (e) {
        console.log('Web Audio API is not supported in this browser');
      }
    }

    // Toggle settings panel
    function toggleSettings() {
      document.getElementById('settingsPanel').classList.toggle('open');
    }

    // Set alarm
    function setAlarm() {
      const alarmTimeInput = document.getElementById('alarmTime');
      const time = alarmTimeInput.value;
      
      if (!time) {
        showNotification('Please set a valid time for the alarm');
        return;
      }
      
      const [hours, minutes] = time.split(':');
      const alarm = {
        time: `${hours}:${minutes}`,
        enabled: true
      };
      
      alarms.push(alarm);
      updateAlarmList();
      saveAlarms();
      
      alarmTimeInput.value = '';
      showNotification('Alarm set for ' + formatTime12(parseInt(hours), parseInt(minutes), 0));
    }

    // Delete alarm
    function deleteAlarm(index) {
      alarms.splice(index, 1);
      updateAlarmList();
      saveAlarms();
    }

    // Update alarm list in UI
    function updateAlarmList() {
      const alarmList = document.getElementById('alarmList');
      alarmList.innerHTML = '';
      
      if (alarms.length === 0) {
        alarmList.innerHTML = '<p>No alarms set</p>';
        return;
      }
      
      alarms.forEach((alarm, index) => {
        const [hours, minutes] = alarm.time.split(':');
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';
        alarmItem.innerHTML = `
          <span class="alarm-time">${formatTime12(parseInt(hours), parseInt(minutes), 0)}</span>
          <button class="delete-alarm" onclick="deleteAlarm(${index})">
            <i class="fas fa-trash"></i>
          </button>
        `;
        alarmList.appendChild(alarmItem);
      });
    }

    // Save alarms to local storage
    function saveAlarms() {
      localStorage.setItem('alarms', JSON.stringify(alarms));
    }

    // Check if any alarms should trigger
    function checkAlarms() {
      const now = getCurrentTime();
      const currentTimeString = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTimeString) {
          triggerAlarm();
        }
      });
    }

    // Trigger alarm
    function triggerAlarm() {
      showNotification('Alarm!', true);
      
      // Play sound if enabled
      if (clockSound !== 'none' && audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        // Stop after 2 seconds
        setTimeout(() => {
          oscillator.stop();
        }, 2000);
      }
    }

    // Start timer
    function startTimer() {
      const hours = parseInt(document.getElementById('timerHours').value) || 0;
      const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
      const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
      
      if (hours === 0 && minutes === 0 && seconds === 0) {
        showNotification('Please set a valid timer duration');
        return;
      }
      
      // Clear any existing timer
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      // Calculate total seconds
      timerTime = hours * 3600 + minutes * 60 + seconds;
      updateTimerDisplay();
      
      // Start countdown
      timerInterval = setInterval(() => {
        timerTime--;
        updateTimerDisplay();
        
        if (timerTime <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          showNotification('Timer finished!', true);
          
          // Play sound if enabled
          if (clockSound !== 'none' && audioContext) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1.0);
          }
        }
      }, 1000);
    }

    // Pause timer
    function pauseTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    // Reset timer
    function resetTimer() {
      pauseTimer();
      timerTime = 0;
      updateTimerDisplay();
      
      document.getElementById('timerHours').value = '';
      document.getElementById('timerMinutes').value = '';
      document.getElementById('timerSeconds').value = '';
    }

    // Update timer display
    function updateTimerDisplay() {
      const hours = Math.floor(timerTime / 3600);
      const minutes = Math.floor((timerTime % 3600) / 60);
      const seconds = timerTime % 60;
      
      document.getElementById('timerDisplay').textContent = 
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    // Start stopwatch
    function startStopwatch() {
      if (stopwatchRunning) return;
      
      stopwatchRunning = true;
      const startTime = Date.now() - (stopwatchTime || 0);
      
      stopwatchInterval = setInterval(() => {
        stopwatchTime = Date.now() - startTime;
        updateStopwatchDisplay();
      }, 10);
    }

    // Pause stopwatch
    function pauseStopwatch() {
      stopwatchRunning = false;
      clearInterval(stopwatchInterval);
    }

    // Reset stopwatch
    function resetStopwatch() {
      pauseStopwatch();
      stopwatchTime = 0;
      updateStopwatchDisplay();
      document.getElementById('lapsList').innerHTML = '';
      laps = [];
    }

    // Record lap time
    function lapStopwatch() {
      if (!stopwatchRunning) return;
      
      laps.push(stopwatchTime);
      const lapsList = document.getElementById('lapsList');
      
      const lapItem = document.createElement('div');
      lapItem.className = 'alarm-item';
      lapItem.textContent = `Lap ${laps.length}: ${formatStopwatchTime(stopwatchTime)}`;
      
      lapsList.prepend(lapItem);
    }

    // Update stopwatch display
    function updateStopwatchDisplay() {
      document.getElementById('stopwatchDisplay').textContent = formatStopwatchTime(stopwatchTime);
    }

    // Format stopwatch time
    function formatStopwatchTime(time) {
      const hours = Math.floor(time / 3600000);
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      const milliseconds = Math.floor((time % 1000) / 10);
      
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
    }

    // Show notification
    function showNotification(message, isImportant = false) {
      const notification = document.getElementById('notification');
      notification.textContent = message;
      
      if (isImportant) {
        notification.style.background = 'rgba(185, 28, 28, 0.9)';
      } else {
        notification.style.background = 'rgba(0, 0, 0, 0.8)';
      }
      
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }

    // Get current time based on selected timezone
    function getCurrentTime() {
      const now = new Date();
      
      if (currentTimezone === 'auto') {
        return now;
      }
      
      // Convert to selected timezone
      const options = { timeZone: getTimeZoneOffset(currentTimezone) };
      const timeString = now.toLocaleString('en-US', options);
      return new Date(timeString);
    }

    // Get timezone offset
    function getTimeZoneOffset(timezone) {
      const offsets = {
        'UTC': 'UTC',
        'EST': 'America/New_York',
        'CST': 'America/Chicago',
        'MST': 'America/Denver',
        'PST': 'America/Los_Angeles',
        'GMT': 'Europe/London',
        'CET': 'Europe/Paris',
        'IST': 'Asia/Kolkata',
        'JST': 'Asia/Tokyo',
        'AEST': 'Australia/Sydney'
      };
      
      return offsets[timezone] || 'UTC';
    }

    // Pad numbers with leading zeros
    function pad(n) {
      return n.toString().padStart(2, '0');
    }

    // Format date
    function formatDate(date) {
      const options = { 
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    }

    // Format time in 12-hour format
    function formatTime12(hours, minutes, seconds) {
      const period = hours >= 12 ? 'PM' : 'AM';
      const twelveHour = hours % 12 || 12;
      return `${pad(twelveHour)}:${pad(minutes)}:${pad(seconds)} ${period}`;
    }

    // Toggle clock view
    function toggleClockView() {
      const analogClock = document.getElementById('analogClock');
      const digitalClock = document.getElementById('digitalClock');
      const toggleBtn = document.querySelector('.toggle-btn');
      const title = document.querySelector('h1');
      
      if (analogClock.style.display !== 'none') {
        analogClock.style.display = 'none';
        digitalClock.style.display = 'flex';
        toggleBtn.textContent = 'Switch to Analog';
        toggleBtn.setAttribute('data-view', 'analog');
        title.textContent = 'Digital Clock';
      } else {
        analogClock.style.display = 'flex';
        digitalClock.style.display = 'none';
        toggleBtn.textContent = 'Switch to Digital';
        toggleBtn.setAttribute('data-view', 'digital');
        title.textContent = 'Analog Clock';
      }
    }

    // Update analog clock
    function updateAnalogClock() {
      const now = getCurrentTime();
      
      const sec = now.getSeconds();
      const min = now.getMinutes();
      let hr = now.getHours();
      const period = hr >= 12 ? 'PM' : 'AM';
      
      // Play tick sound if enabled
      if (clockSound === 'tick' && tickSound) {
        tickSound();
      }
      
      const secDeg = smoothSeconds ? sec * 6 + (now.getMilliseconds() * 0.006) : sec * 6;
      const minDeg = min * 6 + sec * 0.1;
      const hrDeg = (hr % 12) * 30 + min * 0.5;
      
      // Update digital clock
      const digitalTime = document.getElementById('digitalTime');
      const periodEl = document.getElementById('period');
      digitalTime.textContent = `${pad(hr)}:${pad(min)}:${pad(sec)}`;
      periodEl.textContent = period;
      
      // Update both clocks with the same date format
      const formattedDate = formatDate(now);
      document.getElementById('date').textContent = formattedDate;
      document.getElementById('analogDate').textContent = formattedDate;
      
      // Update clock hands
      document.getElementById('secondHand').style.transform = `translate(-50%, -100%) rotate(${secDeg}deg)`;
      document.getElementById('minuteHand').style.transform = `translate(-50%, -100%) rotate(${minDeg}deg)`;
      document.getElementById('hourHand').style.transform = `translate(-50%, -100%) rotate(${hrDeg}deg)`;
    }

    // Initialize the clock when the page loads
    window.addEventListener('load', initClock);
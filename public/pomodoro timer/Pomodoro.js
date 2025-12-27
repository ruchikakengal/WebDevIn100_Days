
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timerDisplay = document.getElementById('timer-display');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const sessionIndicators = document.getElementById('session-indicators');

    const modeButtons = {
        work: document.getElementById('work-mode'),
        shortBreak: document.getElementById('short-break-mode'),
        longBreak: document.getElementById('long-break-mode'),
    };

    const settingsModal = document.getElementById('settings-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const durationInputs = {
        work: document.getElementById('work-duration'),
        shortBreak: document.getElementById('short-break-duration'),
        longBreak: document.getElementById('long-break-duration'),
    };

    // Timer State
    let timerId = null;
    let isTimerRunning = false;
    let currentMode = 'work'; // 'work', 'shortBreak', 'longBreak'
    let workSessionsCompleted = 0;
    const longBreakInterval = 4; // Long break after 4 work sessions

    let durations = {
        work: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    let timeRemaining = durations.work;

    // --- Audio Notification ---
    const synth = new Tone.Synth().toDestination();
    function playNotificationSound() {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
        synth.triggerAttackRelease("C5", "8n");
    }

    // --- UI Update Functions ---

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.title = `${timerDisplay.textContent} - Pomodoro`;
    }

    function updateSessionIndicators() {
        sessionIndicators.innerHTML = '';
        for (let i = 0; i < longBreakInterval; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (i < workSessionsCompleted % longBreakInterval) {
                dot.classList.add('filled');
            }
            sessionIndicators.appendChild(dot);
        }
    }

    function updateUIMode() {
        const rootStyles = document.documentElement.style;
        Object.values(modeButtons).forEach(btn => btn.classList.remove('active'));

        switch (currentMode) {
            case 'work':
                rootStyles.setProperty('--body-bg', 'var(--color-bg-work)');
                modeButtons.work.classList.add('active');
                break;
            case 'shortBreak':
                rootStyles.setProperty('--body-bg', 'var(--color-bg-short-break)');
                modeButtons.shortBreak.classList.add('active');
                break;
            case 'longBreak':
                rootStyles.setProperty('--body-bg', 'var(--color-bg-long-break)');
                modeButtons.longBreak.classList.add('active');
                break;
        }
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--body-bg');
    }

    // --- Timer Logic ---

    function tick() {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            playNotificationSound();
            switchToNextMode();
        }
    }

    function startTimer() {
        if (isTimerRunning) return;
        isTimerRunning = true;
        startPauseBtn.textContent = 'Pause';
        timerId = setInterval(tick, 1000);
    }

    function pauseTimer() {
        if (!isTimerRunning) return;
        isTimerRunning = false;
        startPauseBtn.textContent = 'Start';
        clearInterval(timerId);
        timerId = null;
    }

    function resetTimer() {
        pauseTimer();
        timeRemaining = durations[currentMode];
        updateTimerDisplay();
    }

    function switchToNextMode() {
        pauseTimer();
        if (currentMode === 'work') {
            workSessionsCompleted++;
            if (workSessionsCompleted % longBreakInterval === 0) {
                currentMode = 'longBreak';
            } else {
                currentMode = 'shortBreak';
            }
        } else {
            currentMode = 'work';
        }
        resetTimer();
        updateUIMode();
        updateSessionIndicators();
        startTimer();
    }

    function manualSwitchMode(mode) {
        if (currentMode === mode) return;
        currentMode = mode;
        resetTimer();
        updateUIMode();
    }

    // --- Event Listeners ---

    startPauseBtn.addEventListener('click', () => {
        if (Tone.context.state !== 'running') {
            Tone.start();
        }
        isTimerRunning ? pauseTimer() : startTimer();
    });

    resetBtn.addEventListener('click', resetTimer);

    Object.entries(modeButtons).forEach(([mode, button]) => {
        button.addEventListener('click', () => manualSwitchMode(mode));
    });

    // --- Settings Modal Logic ---
    settingsBtn.addEventListener('click', () => {
        durationInputs.work.value = durations.work / 60;
        durationInputs.shortBreak.value = durations.shortBreak / 60;
        durationInputs.longBreak.value = durations.longBreak / 60;
        settingsModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    saveSettingsBtn.addEventListener('click', () => {
        const newWorkDuration = parseInt(durationInputs.work.value, 10);
        const newShortBreakDuration = parseInt(durationInputs.shortBreak.value, 10);
        const newLongBreakDuration = parseInt(durationInputs.longBreak.value, 10);

        if (newWorkDuration > 0) durations.work = newWorkDuration * 60;
        if (newShortBreakDuration > 0) durations.shortBreak = newShortBreakDuration * 60;
        if (newLongBreakDuration > 0) durations.longBreak = newLongBreakDuration * 60;

        settingsModal.classList.add('hidden');

        resetTimer();
    });


    // --- Initial Setup ---
    function initializeApp() {
        updateTimerDisplay();
        updateSessionIndicators();
        updateUIMode();
    }

    initializeApp();
});

// Check if the browser supports the Web Speech API for compatibility.
if ('speechSynthesis' in window) {
    // --- Initialize References ---
    const synth = window.speechSynthesis;
    const textInput = document.getElementById('textToSpeak');
    const speakButton = document.getElementById('speakButton');
    const cancelButton = document.getElementById('cancelButton');

    // --- Speak Button Functionality ---
    speakButton.addEventListener('click', () => {
        const text = textInput.value;
        if (text.trim() !== '') {
            if (synth.speaking) {
                synth.cancel();
            }
            const utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
        } else {
            alert('Please enter some text first.');
        }
    });

    // --- Redirect to Home Button Functionality ---
    cancelButton.addEventListener('click', () => {
        // Stop any speech that is currently in progress.
        if (synth.speaking) {
            synth.cancel();
        }
        // Redirect the user to the home page.
        window.location.href = 'index.html';
    });

} else {
    // If the browser doesn't support the API, alert the user.
    alert("Sorry, your browser does not support Text-to-Speech.");
}

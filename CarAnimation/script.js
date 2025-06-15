let audio = new Audio('sound.mp3');
audio.loop = true;

document.querySelector("body").addEventListener('click', () => {
    audio.play()
      .then(() => console.log("Playing"))
      .catch(err => console.error("Playback error:", err));
});
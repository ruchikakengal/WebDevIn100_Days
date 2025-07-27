 const color1 = document.getElementById("color1");
    const color2 = document.getElementById("color2");
    const color1Value = document.getElementById("color1-value");
    const color2Value = document.getElementById("color2-value");
    const direction = document.getElementById("angle");
    const box = document.getElementById("gradientBox");

    // Update gradient when button is clicked
    document.getElementById("generate").addEventListener("click", () => {
      box.style.background = `linear-gradient(${direction.value}, ${color1.value}, ${color2.value})`;
     const gradient = `linear-gradient(${direction.value}, ${color1.value}, ${color2.value})`;
      box.style.background = gradient;

      
      codeText.textContent = `background: ${gradient};`;
        document.getElementById("gradientCode").style.display = "block";
    });

    // Update text input values when color is changed
    color1.addEventListener("input", () => {
      color1Value.value = color1.value;
    });

    color2.addEventListener("input", () => {
      color2Value.value = color2.value;
    });

    function copyCode(){
        const codeText = document.getElementById("codeText");
        navigator.clipboard.writeText(codeText.textContent)
            .then(() => {
                alert("Code copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy: ", err);
            });

    }
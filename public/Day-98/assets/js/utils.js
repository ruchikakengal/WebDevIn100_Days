export function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
export function replaceArray(arr, values) {
    let length = arr.length;
    Array.prototype.splice.apply(arr, [0, length].concat(values));
}
function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}
export function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI * 2 / maxitem;

    let red = Math.sin(frequency * item + 2 + phase) * width + center;
    let green = Math.sin(frequency * item + 0 + phase) * width + center;
    let blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

export function useAppendableInput(containerId, onChange = (values = []) => { }, maxInput = 20) {
    const inputs = [];
    let fields = 1;
    let pNR = 1;
    let err = 0;

    const container = document.getElementById(containerId);

    container.innerHTML = '';

    const button = document.createElement('button');
    button.textContent = 'Add fields';
    button.addEventListener('click', addInput);
    container.appendChild(button);
    container.appendChild(document.createElement("br"));

    function inputOnChange() {
        onChange(inputs.map(input => input.value).filter(val => val != null && val != ''));
    }

    function addInput() {
        if (fields <= maxInput) {
            const input = document.createElement("input");

            input.type = "text";
            input.name = "input" + pNR;
            input.addEventListener('change', inputOnChange);

            container.appendChild(input);
            container.appendChild(document.createElement("br"));
            inputs.push(input);
            pNR += 1;
            fields += 1;
        } else {
            if (err == 0) {
                container.appendChild(document.createElement("br"))
                container.appendChild(document.createTextNode("Reach maximum allowed for " + maxInput + " fields."));
                err = 1;
            }
        }
    }
}
export function getLastOptions() {
    const json = localStorage.getItem('options');
    return !json ? null : JSON.parse(json);
}
export function saveLastOptions(options) {
    localStorage.setItem('options', JSON.stringify(options));
}
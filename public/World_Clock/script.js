import { timeZonesList } from "./local.js";

document.addEventListener('DOMContentLoaded', onPageLoad);

let dateContainer = document.querySelector('.show-date');
let timeZone = '';

const comboBox = document.querySelector('#localelist');

function onPageLoad() {
    loadLocalesInComboBox();
    let selectedOption = comboBox.options[comboBox.selectedIndex];
    timeZone = comboBox.value;
    comboBox.addEventListener('change',handleComboBox);
    setInterval(displayLocalTime,1000);
}

function handleComboBox(){
    let selectedOption = comboBox.options[comboBox.selectedIndex];
    timeZone = comboBox.value;
}

function displayLocalTime(){
    const date = new Date();
    dateContainer.innerHTML = date.toLocaleString('en-IN',{timeZone:timeZone , hour:'2-digit',minute:'2-digit',second:'2-digit'});
}

function loadLocalesInComboBox() {
    const timeZoneKeys = Object.keys(timeZonesList); 
    timeZoneKeys.sort();
    timeZoneKeys.forEach((tz) => {
        const label = timeZonesList[tz];        
        let newOption = new Option(label.trim(), tz.trim());
        comboBox.add(newOption, undefined);
    });
    comboBox.value = 'Asia/Kolkata';
}

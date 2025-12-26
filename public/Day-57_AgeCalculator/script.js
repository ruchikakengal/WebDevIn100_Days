function calculateAge() {
    const dobString = document.getElementById("dob").value;

    if (!dobString) {
        document.getElementById("result").innerHTML = "Please enter a date of birth.";
        return;
    }

    const dob = new Date(dobString);
    const today = new Date();

    if (dob > today) {
        document.getElementById("result").innerHTML = `Date of birth must be before ${today.toLocaleDateString()}.`;
        return;
    }

    let ageYear = today.getFullYear() - dob.getFullYear();
    let ageMonth = today.getMonth() - dob.getMonth();
    let ageDay = today.getDate() - dob.getDate();

    if (ageDay < 0) {
        ageMonth--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        ageDay += prevMonth.getDate();
    }

    if (ageMonth < 0) {
        ageYear--;
        ageMonth += 12;
    }

    if (dob.getFullYear() < 1950) {
        document.getElementById("result").innerHTML = "You are too young to use this application.";
        return;
    }

    document.getElementById("result").innerHTML = `Your age is: ${ageYear} years, ${ageMonth} months, ${ageDay} days.`;
}

document.getElementById("button").addEventListener("click", calculateAge);

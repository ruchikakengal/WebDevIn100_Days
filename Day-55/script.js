function calculateSplit() {
  const bill = parseFloat(document.getElementById('bill').value);
  const tip = parseFloat(document.getElementById('tip').value || 0);
  const people = parseInt(document.getElementById('people').value);

  if (bill <= 0 || people <= 0 || isNaN(bill) || isNaN(people)) {
    document.getElementById('result').textContent = "Please enter valid inputs.";
    return;
  }

  const tipAmount = (bill * tip) / 100;
  const total = bill + tipAmount;
  const perPerson = total / people;

  document.getElementById('result').textContent = `Each person pays: ₹${perPerson.toFixed(2)}`;
}
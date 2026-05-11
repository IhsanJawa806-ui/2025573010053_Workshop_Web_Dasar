const display = document.getElementById("display");
const buttons = document.getElementById("buttons");

let angkaPertama = "";
let angkaKedua = "";
let operator = "";
let sedangInputKedua = false;

// Update display
function updateDisplay(value) {
  display.textContent = value;
}

// Reset semua
function reset() {
  angkaPertama = "";
  angkaKedua = "";
  operator = "";
  sedangInputKedua = false;
  updateDisplay("0");
}

// Hitung hasil
function hitung() {
  const a = parseFloat(angkaPertama);
  const b = parseFloat(angkaKedua);
  let hasil = 0;

  switch (operator) {
    case "+":
      hasil = a + b;
      break;
    case "-":
      hasil = a - b;
      break;
    case "*":
      hasil = a * b;
      break;
    case "/":
      hasil = b !== 0 ? a / b : "Error";
      break;
  }

  angkaPertama = hasil.toString();
  angkaKedua = "";
  operator = "";
  sedangInputKedua = false;

  updateDisplay(angkaPertama);
}

// Event delegation (SATU listener)
buttons.addEventListener("click", function (e) {
  const value = e.target.dataset.value;
  if (!value) return;

  handleInput(value);
});

// Keyboard support
document.addEventListener("keydown", function (e) {
  let key = e.key;

  if (!isNaN(key) || key === ".") {
    handleInput(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    handleInput(key);
  } else if (key === "Enter") {
    handleInput("=");
  } else if (key === "Escape") {
    handleInput("C");
  }
});

// Logika input
function handleInput(value) {
  if (!isNaN(value) || value === ".") {
    // input angka
    if (!sedangInputKedua) {
      angkaPertama += value;
      updateDisplay(angkaPertama);
    } else {
      angkaKedua += value;
      updateDisplay(angkaKedua);
    }
  } else if (["+", "-", "*", "/"].includes(value)) {
    // operator
    if (angkaPertama === "") return;
    operator = value;
    sedangInputKedua = true;
  } else if (value === "=") {
    if (angkaPertama && angkaKedua && operator) {
      hitung();
    }
  } else if (value === "C") {
    reset();
  }
}

type BMIResult = {
  bmi: number;
  category: string;
  interpretation: string;
  barWidth: number;
  textColorClass: string;
};

const heightInput = document.getElementById("height") as HTMLInputElement;
const weightInput = document.getElementById("weight") as HTMLInputElement;
const bmiValue = document.getElementById("bmiValue") as HTMLElement;
const bmiStatus = document.getElementById("bmiStatus") as HTMLElement;
const bmiInterpretation = document.getElementById("bmiInterpretation") as HTMLElement;
const bmiBar = document.getElementById("bmiBar") as HTMLElement;
const heightError = document.getElementById("heightError") as HTMLElement;
const weightError = document.getElementById("weightError") as HTMLElement;

function calculateBMI(): void {
  const height = parseFloat(heightInput.value);
  const weight = parseFloat(weightInput.value);
  clearErrors();

  if (!validateInputs(height, weight)) return;

  const bmi = calculateBMIValue(height, weight);
  const result = getBMIResult(bmi);
  displayResult(result);
}

function isValidHeight(height: number): boolean {
  return !isNaN(height) && height >= 50 && height <= 250;
}

function isValidWeight(weight: number): boolean {
  return !isNaN(weight) && weight >= 10 && weight <= 300;
}

function validateInputs(height: number, weight: number): boolean {
  let valid = true;

  if (!isValidHeight(height)) {
    showError(heightError, "Enter a valid height (50-250 cm)");
    valid = false;
  }

  if (!isValidWeight(weight)) {
    showError(weightError, "Enter a valid weight (10-300 kg)");
    valid = false;
  }

  return valid;
}

heightInput.addEventListener("input", () => {
  const height = parseFloat(heightInput.value);
  if (isValidHeight(height)) {
    heightError.classList.add("hidden");
  }
});

weightInput.addEventListener("input", () => {
  const weight = parseFloat(weightInput.value);
  if (isValidWeight(weight)) {
    weightError.classList.add("hidden");
  }
});

function calculateBMIValue(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

function getBMIResult(bmi: number): BMIResult {
  if (bmi < 18.5) {
    return {
      bmi,
      category: "Underweight",
      interpretation: "You are below a healthy weight. Consider improving nutrition.",
      barWidth: 25,
      textColorClass: "text-blue-500"
    };
  }
  else if (bmi <= 24.9) {
    return {
      bmi,
      category: "Normal",
      interpretation: "You are in a healthy weight range. Keep it up!",
      barWidth: 50,
      textColorClass: "text-green-500"
    };
  }
  else if (bmi <= 29.9) {
    return {
      bmi,
      category: "Overweight",
      interpretation: "You are slightly overweight. Consider healthy lifestyle changes.",
      barWidth: 75,
      textColorClass: "text-yellow-500"
    };
  }
  else {
    return {
      bmi,
      category: "Obese",
      interpretation: "You are in a high BMI range. Consult a doctor if needed.",
      barWidth: 100,
      textColorClass: "text-red-500"
    };
  }
}

function displayResult(result: BMIResult): void {
  bmiValue.textContent = result.bmi.toString();
  bmiStatus.textContent = result.category;

  bmiStatus.className = `mt-3 text-xl font-semibold ${result.textColorClass}`;

  bmiInterpretation.textContent = result.interpretation;
  bmiInterpretation.classList.remove("hidden");

  bmiBar.style.width = `${result.barWidth}%`;
}

function showError(element: HTMLElement, message: string): void {
  element.textContent = message;
  element.classList.remove("hidden");
}

function clearErrors(): void {
  heightError.classList.add("hidden");
  weightError.classList.add("hidden");
}

var heightInput = document.getElementById("height");
var weightInput = document.getElementById("weight");
var bmiValue = document.getElementById("bmiValue");
var bmiStatus = document.getElementById("bmiStatus");
var bmiInterpretation = document.getElementById("bmiInterpretation");
var bmiBar = document.getElementById("bmiBar");
var heightError = document.getElementById("heightError");
var weightError = document.getElementById("weightError");
function calculateBMI() {
    var height = parseFloat(heightInput.value);
    var weight = parseFloat(weightInput.value);
    clearErrors();
    if (!validateInputs(height, weight))
        return;
    var bmi = calculateBMIValue(height, weight);
    var result = getBMIResult(bmi);
    displayResult(result);
}
function isValidHeight(height) {
    return !isNaN(height) && height >= 50 && height <= 250;
}
function isValidWeight(weight) {
    return !isNaN(weight) && weight >= 10 && weight <= 300;
}
function validateInputs(height, weight) {
    var valid = true;
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
heightInput.addEventListener("input", function () {
    var height = parseFloat(heightInput.value);
    if (isValidHeight(height)) {
        heightError.classList.add("hidden");
    }
});
weightInput.addEventListener("input", function () {
    var weight = parseFloat(weightInput.value);
    if (isValidWeight(weight)) {
        weightError.classList.add("hidden");
    }
});
function calculateBMIValue(height, weight) {
    var heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}
function getBMIResult(bmi) {
    if (bmi < 18.5) {
        return {
            bmi: bmi,
            category: "Underweight",
            interpretation: "You are below a healthy weight. Consider improving nutrition.",
            barWidth: 25,
            textColorClass: "text-blue-500"
        };
    }
    else if (bmi <= 24.9) {
        return {
            bmi: bmi,
            category: "Normal",
            interpretation: "You are in a healthy weight range. Keep it up!",
            barWidth: 50,
            textColorClass: "text-green-500"
        };
    }
    else if (bmi <= 29.9) {
        return {
            bmi: bmi,
            category: "Overweight",
            interpretation: "You are slightly overweight. Consider healthy lifestyle changes.",
            barWidth: 75,
            textColorClass: "text-yellow-500"
        };
    }
    else {
        return {
            bmi: bmi,
            category: "Obese",
            interpretation: "You are in a high BMI range. Consult a doctor if needed.",
            barWidth: 100,
            textColorClass: "text-red-500"
        };
    }
}
function displayResult(result) {
    bmiValue.textContent = result.bmi.toString();
    bmiStatus.textContent = result.category;
    bmiStatus.className = "mt-3 text-xl font-semibold ".concat(result.textColorClass);
    bmiInterpretation.textContent = result.interpretation;
    bmiInterpretation.classList.remove("hidden");
    bmiBar.style.width = "".concat(result.barWidth, "%");
}
function showError(element, message) {
    element.textContent = message;
    element.classList.remove("hidden");
}
function clearErrors() {
    heightError.classList.add("hidden");
    weightError.classList.add("hidden");
}

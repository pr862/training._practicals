document.addEventListener("DOMContentLoaded", function() {
  const nameInput = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  nameInput.addEventListener("input", function() {
    this.value.trim() === "" 
      ? showError("nameError", "Name is required") 
      : clearError("nameError");
  });

  email.addEventListener("input", function() {
    if (this.value.trim() === "") {
      showError("emailError", "Email is required");
      return;
    }
    let emailPattern = /^[^ ]+@[^ ]+\.[a-zA-Z]{2,}$/;
    !emailPattern.test(this.value) 
      ? showError("emailError", "Invalid email format") 
      : clearError("emailError");
  });

  phone.addEventListener("input", function() {
    if (this.value.trim() === "") {
      showError("phoneError", "Phone number is required");
      return;
    }
    let phonePattern = /^[0-9]{10}$/;
    !phonePattern.test(this.value) 
      ? showError("phoneError", "Enter valid 10-digit phone number") 
      : clearError("phoneError");
  });

  password.addEventListener("input", function() {
    let password = this.value;
    if (this.value.trim() === "") {
      showError("passwordError", "Password is required");
      return;
    }

    let errors = [];
    if (this.value.length < 8) errors.push("at least 8 characters");
    if (!/[a-z]/.test(this.value)) errors.push("lowercase letter");
    if (!/[A-Z]/.test(this.value)) errors.push("uppercase letter");
    if (!/[^A-Za-z0-9]/.test(this.value)) errors.push("special character");

    errors.length 
      ? showError("passwordError", `Password must contain: ${errors.join(", ")}.`) 
      : clearError("passwordError");
  });

  confirmPassword.addEventListener("input", function() {
    this.value !== password.value 
      ? showError("confirmError", "Passwords do not match") 
      : clearError("confirmError");
  });
});

document.getElementById("myForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let valid = true;

  let nameInput = document.getElementById("name");
  let email = document.getElementById("email");
  let phone = document.getElementById("phone");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");

  clearErrors();

  if (nameInput.value.trim() === "") {
    showError("nameError", "Name is required");
    valid = false;
  }

  let emailPattern = /^[^ ]+@[^ ]+\.[a-zA-Z]{2,}$/;
  if (email.value.trim() === "") {
    showError("emailError", "Email is required");
    valid = false;
  } else if (!emailPattern.test(email.value)) {
    showError("emailError", "Invalid email format");
    valid = false;
  }

  let phonePattern = /^[0-9]{10}$/;
  if (phone.value.trim() === "") {
    showError("phoneError", "Phone number is required");
    valid = false;
  } else if (!phonePattern.test(phone.value)) {
    showError("phoneError", "Enter valid 10-digit phone number");
    valid = false;
  }

  let errors = [];
  if (password.value.trim() === "") {
    showError("passwordError", "Password is required");
    valid = false;
  } else {
    if (password.value.length < 8) errors.push("at least 8 characters");
    if (!/[a-z]/.test(password.value)) errors.push("lowercase letter");
    if (!/[A-Z]/.test(password.value)) errors.push("uppercase letter");
    if (!/[^A-Za-z0-9]/.test(password.value)) errors.push("special character");
  }

  if (errors.length) {
    showError("passwordError", `Password must contain: ${errors.join(", ")}.`);
    valid = false;
  }

  if (confirmPassword.value !== password.value) {
    showError("confirmError", "Passwords do not match");
    valid = false;
  }

  if (valid) {
    ajaxInsert(nameInput.value, email.value, phone.value);
    document.getElementById("myForm").reset();
    showSuccessPopup();
  }
});

function showError(id, message) {
  document.getElementById(id).innerText = message;
}

function clearError(id) {
  document.getElementById(id).innerText = "";
}

function clearErrors() {
  document.querySelectorAll(".text-red-500").forEach(e => e.innerText = "");
}

function ajaxInsert(name, email, phone) {
  const password = document.getElementById("password").value;
  setTimeout(() => {
    let row = `
      <tr class="hover:bg-gray-100">
        <td class="border p-2">${name}</td>
        <td class="border p-2">${email}</td>
        <td class="border p-2">${phone}</td>
        <td class="border p-2">${password}</td>
      </tr>`;
    document.getElementById("dataTable").innerHTML += row;
  }, 300);
}

function showSuccessPopup() {
  const popup = document.getElementById("successPopup");
  popup.classList.remove("hidden");
  document.getElementById("closePopup").onclick = function() {
    popup.classList.add("hidden");
  };
}

function togglePassword(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

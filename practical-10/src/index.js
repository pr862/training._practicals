document.getElementById("myForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let valid = true;

  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let phone = document.getElementById("phone");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");

  clearErrors();

  if (name.value.trim() === "") {
    showError("nameError", "Name is required");
    valid = false;
  }

  let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email.value)) {
    showError("emailError", "Invalid email format");
    valid = false;
  }

  let phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone.value)) {
    showError("phoneError", "Enter valid 10-digit phone number");
    valid = false;
  }

  let passValid = true;
  if (password.value.length < 8) passValid = false;
  if (!/[a-z]/.test(password.value)) passValid = false;
  if (!/[^A-Za-z0-9]/.test(password.value)) passValid = false;
  if (!/[A-Z]/.test(password.value)) passValid = false;
  if (!passValid) {
    showError("passwordError", "Password must be 8+ characters, contain lowercase, uppercase and special character.");
    valid = false;
  }

  if (confirmPassword.value !== password.value) {
    showError("confirmError", "Passwords do not match");
    valid = false;
  }

  if (valid) {
    ajaxInsert(name.value, email.value, phone.value);
    document.getElementById("myForm").reset();
    showSuccessPopup();
  }
});

function showError(id, message) {
  document.getElementById(id).innerText = message;
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

const loginCredentials = "Spider-man";
const loginPassword = "Jefferson";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("prowler-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");

  let failedAttempts = parseInt(localStorage.getItem("failedAttempts")) || 0;

  if (failedAttempts >= 2) {
    console.warn("Form is locked due to too many failed attempts.");
    lockForm();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous errors
    usernameError.textContent = "";
    passwordError.textContent = "";
    usernameError.style.opacity = 0;
    passwordError.style.opacity = 0;
    usernameInput.style.borderColor = "";
    passwordInput.style.borderColor = "";

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    console.log("Submitted Username:", username);
    console.log("Submitted Password:", password);

    let isValid = true;

    const nameRegex = /^[a-zA-Z-]{1,30}$/;
    if (!nameRegex.test(username)) {
      usernameError.textContent = "Username must be your Secret Identity, Miles.";
      usernameError.style.opacity = 1;
      usernameInput.style.borderColor = "red";
      console.error("Username validation failed.");
      isValid = false;
    }

    const passRegex = /^[A-Z][a-z]{2,}$/; // Matches "Jefferson"
    if (!passRegex.test(password)) {
      passwordError.textContent = "Password must be your father's first name, Miles.";
      passwordError.style.opacity = 1;
      passwordInput.style.borderColor = "red";
      console.error("Password validation failed.");
      isValid = false;
    }

    if (!isValid) {
      console.warn("Form submission blocked due to validation errors.");
      return;
    }

    if (username === loginCredentials && password === loginPassword) {
      console.log("Login successful. Redirecting...");
      localStorage.setItem("failedAttempts", "0");
      alert("Welcome, Miles");
      window.location.href = "forecast.html";
    } else {
      failedAttempts++;
      localStorage.setItem("failedAttempts", failedAttempts.toString());
      console.warn(`Login failed. Attempt ${failedAttempts} of 2.`);

      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);

      if (failedAttempts >= 2) {
        alert("Access Denied. You have been locked out.");
        lockForm();
      } else {
        alert("Invalid Credentials. You Have One Attempt Remaining.");
      }
    }
  });

  form.addEventListener("reset", function () {
    console.log("Form reset.");
    localStorage.setItem("failedAttempts", "0");
    usernameError.textContent = "";
    passwordError.textContent = "";
    usernameError.style.opacity = 0;
    passwordError.style.opacity = 0;
    usernameInput.style.borderColor = "";
    passwordInput.style.borderColor = "";
    usernameInput.disabled = false;
    passwordInput.disabled = false;
    form.querySelector("button[type='submit']").disabled = false;

    const lockMsg = form.querySelector("div[style*='Access Denied']");
    if (lockMsg) lockMsg.remove();
  });

  function lockForm() {
    usernameInput.disabled = true;
    passwordInput.disabled = true;
    form.querySelector("button[type='submit']").disabled = true;

    const lockMsg = document.createElement("div");
    lockMsg.textContent = "Access Denied. You have been locked out.";
    lockMsg.style.color = "red";
    lockMsg.style.marginTop = "20px";
    form.appendChild(lockMsg);
  }
});

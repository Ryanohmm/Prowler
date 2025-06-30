
  const loginCredentials = "Spider-man";
  const loginPassword = "Jefferson";

  
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("prowler-form");



    form.addEventListener("submit", function (event) {
      event.preventDefault(); 
      

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();



     let isValid = true;


      const nameRegex = /^[a-zA-Z]{1,30}$/;
    if (!nameRegex.test(username)) {
        document.getElementById("username-error").textContent = 
            "Username must be your Secret Identity, Miles.";
        isValid = false;
    }

     const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    if (!passRegex.test(password)) {
        document.getElementById("password-error").textContent = 
            "Password must be your father's first name, Miles.";
        isValid = false;
    }

      if (isValid && username === loginCredentials && password === loginPassword) {
        alert("Welcome, Miles");
        console.log("Welcome, Miles.");
        window.location.href = "forecast.html"; // ✅ 
      } else {
        alert("Invalid Credentials. You Have One Attempt Remaining.");
      }
    });
    form.addEventListener("reset", function () {
  document.getElementById("username-error").textContent = "";
  document.getElementById("password-error").textContent = "";
});
  });

  



const API_URL = "/api";


// Show Register
function showRegister() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("registerSection").classList.remove("hidden");
    document.getElementById("message").textContent = "";
}


// Show Login
function showLogin() {
    document.getElementById("registerSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("message").textContent = "";
}


// Register
async function register() {

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!name || !email || !password) {
        showMessage("Please fill all fields.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage("Registration successful! Please login.");
            showLogin();
        } else {
            showMessage(data.message);
        }

    } catch (error) {
        showMessage("Server error. Please try again.");
    }
}


// Login
async function login() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showMessage("Please enter email and password.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("token", data.token);

            window.location.href = "dashboard.html";

        } else {
            showMessage(data.message);
        }

    } catch (error) {
        showMessage("Server error. Please try again.");
    }
}


// Show Message
function showMessage(message) {
    document.getElementById("message").textContent = message;
}
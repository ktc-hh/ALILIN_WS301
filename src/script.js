
// Get the form and important elements
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const agreement = document.getElementById("agreement");
const agreementError = document.getElementById("agreementError");

// Get all fields that need validation
const fields = form.querySelectorAll(
    "input:not([type='checkbox']):not([type='submit']):not([type='reset']), select, textarea"
);

// Display an error message for a specific field
function showError(field, message) {
    field.classList.add("error");

    const errorMessage = field.parentElement.querySelector(".error-message");

    if (errorMessage) {
        errorMessage.textContent = message;
    }

    field.setAttribute("aria-invalid", "true");
}

// Remove an error when a field is corrected
function clearError(field) {
    field.classList.remove("error");

    const errorMessage = field.parentElement.querySelector(".error-message");

    if (errorMessage) {
        errorMessage.textContent = "";
    }

    field.removeAttribute("aria-invalid");
}

// Validate an individual field
function validateField(field) {
    // Remove unnecessary spaces using trim()
    if (field.type !== "date") {
        field.value = field.value.trim();
    }

    const value = field.value;
    const label = field.dataset.label || "This field";

    if (!value) {
        showError(field, label + " is required.");
        return false;
    }

    // Validate email address
    if (field.type === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            showError(field, "Please enter a valid email address.");
            return false;
        }
    }

    // Validate an 11-digit Philippine mobile number
    if (field.id === "phone") {
        const phonePattern = /^09\d{9}$/;

        if (!phonePattern.test(value)) {
            showError(
                field,
                "Enter an 11-digit mobile number starting with 09."
            );
            return false;
        }
    }

    // Validate date of birth
    if (field.type === "date") {
        const birthDate = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
            showError(field, "Please enter a valid date of birth.");
            return false;
        }
    }

    // Validate password length
    if (field.id === "password" && value.length < 8) {
        showError(field, "Password must contain at least 8 characters.");
        return false;
    }

    // Confirm that passwords match
    if (field.id === "confirmPassword" &&
        value !== password.value) {
        showError(field, "Passwords do not match.");
        return false;
    }

    // Clear the error if the field is valid
    clearError(field);
    return true;
}

// Validate all fields when the form is submitted
form.addEventListener("submit", function(event) {
    // Prevent submission until validation is complete
    event.preventDefault();

    let isValid = true;
    let firstInvalidField = null;

    successMessage.hidden = true;
    successMessage.textContent = "";

    fields.forEach(function(field) {
        const valid = validateField(field);

        if (!valid) {
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }
    });

    // Validate agreement checkbox separately
    if (!agreement.checked) {
        agreementError.textContent =
            "You must agree before registering.";

        agreement.classList.add("error");
        agreement.setAttribute("aria-invalid", "true");
        isValid = false;

        if (!firstInvalidField) {
            firstInvalidField = agreement;
        }
    } else {
        agreementError.textContent = "";
        agreement.classList.remove("error");
        agreement.removeAttribute("aria-invalid");
    }

    // Stop if any field is invalid
    if (!isValid) {
        firstInvalidField.focus();
        return;
    }

    // Show success only when every field is valid
    successMessage.textContent =
        "Registration successful! Your form has been validated.";

    successMessage.hidden = false;

    // Clear all validation errors after success
    fields.forEach(function(field) {
        clearError(field);
    });

    agreementError.textContent = "";
    agreement.classList.remove("error");
    agreement.removeAttribute("aria-invalid");

    // Demonstrate meaningful HTML attribute manipulation
    // Prevent another submission until the form is reset
    form.setAttribute("data-registration-status", "successful");

    const submitButton = form.querySelector(
        "button[type='submit']"
    );

    submitButton.disabled = true;
    submitButton.textContent = "Registration Complete";
});

// Clear individual errors when the user edits a field
fields.forEach(function(field) {
    field.addEventListener("input", function() {
        successMessage.hidden = true;

        if (field.classList.contains("error")) {
            validateField(field);
        }

        // Recheck confirmation if the original password changes
        if (field.id === "password" &&
            confirmPassword.value !== "") {
            validateField(confirmPassword);
        }
    });

    field.addEventListener("change", function() {
        if (field.classList.contains("error")) {
            validateField(field);
        }
    });
});

// Clear the agreement error when checked
agreement.addEventListener("change", function() {
    if (agreement.checked) {
        agreementError.textContent = "";
        agreement.classList.remove("error");
        agreement.removeAttribute("aria-invalid");
    }
});

// Show or hide passwords using classList.toggle()
togglePassword.addEventListener("click", function() {
    const isVisible = togglePassword.classList.toggle("visible");

    // Dynamically change the HTML type attribute
    password.setAttribute("type", isVisible ? "text" : "password");
    confirmPassword.setAttribute(
        "type",
        isVisible ? "text" : "password"
    );

    togglePassword.textContent = isVisible
        ? "Hide Passwords"
        : "Show Passwords";
});

// Restore the form to its original state
form.addEventListener("reset", function() {
    // Allow the browser to reset input values first
    setTimeout(function() {
        fields.forEach(function(field) {
            clearError(field);
        });

        agreement.classList.remove("error");
        agreement.removeAttribute("aria-invalid");
        agreementError.textContent = "";

        successMessage.hidden = true;
        successMessage.textContent = "";

        togglePassword.classList.remove("visible");
        togglePassword.textContent = "Show Passwords";

        password.setAttribute("type", "password");
        confirmPassword.setAttribute("type", "password");

        form.removeAttribute("data-registration-status");

        const submitButton = form.querySelector(
            "button[type='submit']"
        );

        submitButton.disabled = false;
        submitButton.textContent = "Register Now";
    }, 0);
});
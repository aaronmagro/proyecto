// Script para mostrar u ocultar la contraseña
function togglePasswordVisibility(passwordId, iconId) {
    var passwordInput = document.getElementById(passwordId);
    var icon = document.getElementById(iconId);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

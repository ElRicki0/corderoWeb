// ? este archivo cumple la función de alertar o limita al usuario para que ingrese los datos solicitados

// Codigo de validacion de campo email
function formatEmail(input) {

    // Obtener el valor actual del campo de entrada
    let Email = input.value;

    // Validar formato de correo electrónico
    let emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailPattern.test(Email)) {

        // Mostrar mensaje de error
        input.classList.add("is-invalid");
    }

    // En caso de pasar el test del formato
    else {
        input.setCustomValidity("");
        input.classList.remove("is-invalid");
    }

    // Establecer el valor formateado en el campo de entrada
    input.value = Email;
}

// Codigo de validacion de campo de contraseña
function formatPassword(input) {

    // Obtener el valor actual del campo de entrada
    let Contraseña = input.value;

    // Validar longitud mínima de contraseña
    if (Contraseña.length < 8) {

        // Mostrar mensaje de error
        input.classList.add("is-invalid");
    }

    // En caso de pasar el test del formato
    else {
        input.setCustomValidity("");
        input.classList.remove("is-invalid");
    }

    // Establecer el valor formateado en el campo de entrada
    input.value = Contraseña;
}

// Codigo de validacion de campo alfabetico
function formatAlphabetic(input) {
    // Remover caracteres no permitidos en tiempo real
    input.value = input.value.replace(/[^a-zA-ZñÑáÁéÉíÍóÓúÚ\s]/g, '');
    
    // Verificar si el campo contiene solo letras y espacios
    let textPattern = /^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]*$/;

    if (!textPattern.test(input.value)) {
        input.classList.add("is-invalid");  // Agrega clase de error si hay caracteres inválidos
    } else {
        input.setCustomValidity("");
        input.classList.remove("is-invalid");  // Elimina la clase de error si es válido
    }
}

// Codigo de validacion campo telefonico
function formatPhoneNumber(input) {
    // Remover cualquier carácter que no sea número o guion
    input.value = input.value.replace(/[^0-9-]/g, '');

    // Obtener el valor actual sin guiones
    let phoneNumber = input.value.replace(/-/g, '');

    // Limitar a 8 dígitos numéricos
    if (phoneNumber.length > 8) {
        phoneNumber = phoneNumber.slice(0, 8);
    }

    // Agregar el guion después del cuarto dígito automáticamente
    if (phoneNumber.length > 4) {
        phoneNumber = phoneNumber.slice(0, 4) + '-' + phoneNumber.slice(4);
    }

    // Establecer el valor formateado en el campo de entrada
    input.value = phoneNumber;

    // Validar el formato XXXX-XXXX
    let phoneNumberPattern = /^[0-9]{4}-[0-9]{4}$/;
    if (!phoneNumberPattern.test(input.value)) {
        input.classList.add("is-invalid"); // Agregar clase de error si no cumple el formato
    } else {
        input.classList.remove("is-invalid"); // Eliminar clase de error si es válido
    }
}

    // codigo de validacion campo codigo
    function formatCode(input) {
        // 1. Remover caracteres no permitidos (números y guiones)
        let cleanValue = input.value.replace(/[^0-9a-zA-Z-]/g, '');
        
        // 2. Eliminar guiones para contar dígitos
        let digitsOnly = cleanValue.replace(/-/g, '');
        
        // 3. Limitar a 6 dígitos numéricos (sin contar guiones)
        if (digitsOnly.length > 6) {
            // Reconstruir el valor manteniendo guiones pero limitando dígitos
            cleanValue = cleanValue.slice(0, 6 + (cleanValue.match(/-/g)?.length || 0));
            digitsOnly = digitsOnly.slice(0, 6);
        }
        
        // 4. Actualizar el valor del input (conservando guiones válidos)
        input.value = cleanValue;
        
        // 5. Validar longitud
        if (digitsOnly.length < 5) {
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    }

// Codigo de validacion de campo de contraseña
function formatPassword(input) {

    // Obtener el valor actual del campo de entrada
    let Contraseña = input.value;

    // Validar longitud mínima de contraseña
    if (Contraseña.length < 8) {

        // Mostrar mensaje de error
        input.classList.add("is-invalid");
    }

    // En caso de pasar el test del formato
    else {
        input.setCustomValidity("");
        input.classList.remove("is-invalid");
    }

    // Establecer el valor formateado en el campo de entrada
    input.value = Contraseña;
}

// Código de validación de campo de DUI
function formatDui(input) {
    // Obtener el valor actual del campo de entrada
    let Dui = input.value;

    // Eliminar caracteres que no sean números o guion
    Dui = Dui.replace(/[^\d-]/g, '');

    // Eliminar cualquier guion presente y reconstruir el formato correctamente
    Dui = Dui.replace(/-/g, ''); 

    // Insertar el guion solo en la posición correcta (después del octavo dígito)
    if (Dui.length > 8) {
        Dui = Dui.slice(0, 8) + '-' + Dui.slice(8, 9);
    }

    // Establecer el formato de tipo DUI correcto
    let duiPattern = /^\d{8}-\d$/;
    if (!duiPattern.test(Dui)) {
        // Mostrar mensaje de error
        input.classList.add("is-invalid");
    } else {
        // En caso de pasar la validación
        input.setCustomValidity("");
        input.classList.remove("is-invalid");
    }

    // Establecer el valor formateado en el campo de entrada
    input.value = Dui;

    // Limitar la cantidad máxima de caracteres a 10
    input.setAttribute("maxlength", "10");
}

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    MAIN_TITLE.textContent = 'Pagina principal';
    // Llamada a la función para mostrar el encabezado y pie del documento.
    loadTemplate();
});
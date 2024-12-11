/*
* Controlador de uso general en las páginas web del sitio privado.
* Sirve para manejar la plantilla del encabezado y pie del documento.
*/

// Constante para completar la ruta de la API.
const USER_API = 'services/admin/administrador.php';
// Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');
MAIN.style.paddingTop = '75px';
MAIN.style.paddingBottom = '100px';
MAIN.classList.add('container');
// Se establece el título de la página web.
document.querySelector('title').textContent = 'Corderos WEB - Dashboard';
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');
MAIN_TITLE.classList.add('text-center', 'py-3');

/* Función asíncrona para cargar el encabezado y pie del documento.
* Parámetros: ninguno.
* Retorno: ninguno.
*/
const loadTemplate = async () => {
    // Petición para obtener en nombre del usuario que ha iniciado sesión.
    const DATA = await fetchData(USER_API, 'getUser');
    // Se verifica si el usuario está autenticado, de lo contrario se envía a iniciar sesión.
    if (DATA.session) {
        // Se comprueba si existe un alias definido para el usuario, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
<header>
    <nav role="navigation">
        <div id="menuToggle">
            <!-- ? check box para comprobar si esta abierto o cerrado el menu -->
            <input type="checkbox" id="menuCheckbox" />

            <!-- ? con ayuda del css, estos span funcionan como hamburguesa animada -->
            <span></span>
            <span></span>
            <span></span>

            <!-- ? contenido del menu pero es pura magia de css -->
            <ul id="menu">
                <li>
                    <a href="../../views/admin/inicio.html">
                        <label for="menuCheckbox" onclick="this.parentNode.click();">Inicio</label>
                    </a>
                <li>
                    <a href="../../views/admin/administradores.html">
                        <label for="menuCheckbox" onclick="this.parentNode.click();">Administradores</label>
                    </a>
                </li>
                <li>
                    <a href="../../views/admin/cables.html">
                        <label for="menuCheckbox" onclick="this.parentNode.click();">Cables</label>
                    </a>
                </li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
                <li><a></a></li>
            </ul>
        </div>
    </nav>
</header>
`);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
<footer>
    <nav class="navbar fixed-bottom bg-body-tertiary">
        <div class="container">
            <div>
                <p><a class="nav-link" href="https://github.com/dacasoft/coffeeshop" target="_blank"><i
                            class="bi bi-github"></i> CoffeeShop</a></p>
                <p><i class="bi bi-c-square-fill"></i> 2018-2024 Todos los derechos reservados</p>
            </div>
            <div>
                <p><a class="nav-link" href="../public/" target="_blank"><i class="bi bi-cart-fill"></i> Sitio
                        público</a></p>
                <p><i class="bi bi-envelope-fill"></i> dacasoft@outlook.com</p>
            </div>
        </div>
    </nav>
</footer>
`);
        } else {
            sweetAlert(3, DATA.error, false, 'index.html');
        }
    } else {
        // Se comprueba si la página web es la principal, de lo contrario se direcciona a iniciar sesión.
        if (location.pathname.endsWith('index.html') || location.pathname.endsWith('signup.html')) {
            // Se agrega el encabezado de la página web antes del contenido principal.
            MAIN.insertAdjacentHTML('beforebegin', `
<header>
    <nav class="navbar fixed-top bg-body-tertiary">
        <div class="container">
            <a class="navbar-brand" href="index.html">
                <img src="../../resources/img/logo.png" alt="inventory" width="50">
            </a>
        </div>
    </nav>
</header>
`);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
<footer>
    <nav class="navbar fixed-bottom bg-body-tertiary">
        <div class="container">
            <p><a class="nav-link" href="https://github.com/dacasoft/coffeeshop" target="_blank"><i
                        class="bi bi-github"></i> CoffeeShop</a></p>
            <p><i class="bi bi-envelope-fill"></i> dacasoft@outlook.com</p>
        </div>
    </nav>
</footer>
`);
        } else {
            location.href = 'index.html';
        }
    }
}
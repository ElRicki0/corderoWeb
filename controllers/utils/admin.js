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
                <li>
                    <a href="../../views/admin/cables.html">
                        <label for="menuCheckbox" onclick="this.parentNode.click();">Cerrar Sesión</label>
                    </a>
                </li>
                <li>
                    <a href="../../views/admin/perfil.html">
                        <label for="menuCheckbox" onclick="this.parentNode.click();">Perfil</label>
                        <i class="bi bi-person-circle"></i>
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
            </ul>
        </div>
    </nav>
</header>
`);
            // Se agrega el pie de la página web después del contenido principal.
            MAIN.insertAdjacentHTML('afterend', `
  <!-- Site footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <h6>Sobre este sistema</h6>
                    <p class="text-justify">Este es un sistema creado y moldeado para un control mayor sobre el inventario general de la empresa
                        como pueden ser los EPP <i>(EQUIPO DE PROTECCIÓN PERSONAL)</i>, Guantes, escaleras, cables, equipo de reparación, herramientas
                        y control de horarios laborales de empleados y su ubicación por GPS. 
                    </p>
                </div>

                <div class="col-xs-6 col-md-3">
                    <h6>Acceso rápido</h6>
                    <ul class="footer-links">
                        <li><a href="../admin/cables.html">Cables</a></li>
                        <li><a href="#">EPP <i>(EQUIPO PROTECCIÓN PERSONAL)</i></a></li>
                        <li><a href="#">Guantes</a></li>
                        <li><a href="#">Escaleras</a></li>
                        <li><a href="#">Equipo de reparación</a></li>
                        <li><a href="#">Consumibles</a></li>
                    </ul>
                </div>

                <div class="col-xs-6 col-md-3">
                    <h6>Estado del  sistema</h6>
                    <ul class="footer-links">
                        <li><a href="#">Ejemplo de grafica</a></li>
                        <li><a href="#">Ejemplo de gráfica</a></li>
                        <li><a href="#">Ejemplo de gráfica</a></li>
                        <li><a href="#">Ejemplo de gráfica</a></li>
                        <li><a href="#">Ejemplo de gráfica</a></li>
                    </ul>
                </div>
            </div>
            <hr>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-8 col-sm-6 col-xs-12">
                    <p class="copyright-text">Copyright &copy; 2024  derechos  reservados
                        <a href="#">Cordero's company</a>.
                    </p>
                </div>

                <!-- botones de conexion con redes sociales -->
                <!-- <div class="col-md-4 col-sm-6 col-xs-12">
                    <ul class="social-icons">
                        <li><a class="facebook" href="#"><i class="fa fa-facebook"></i></a></li>
                        <li><a class="twitter" href="#"><i class="fa fa-twitter"></i></a></li>
                        <li><a class="dribbble" href="#"><i class="fa fa-dribbble"></i></a></li>
                        <li><a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a></li>
                    </ul>
                </div> -->
            </div>
        </div>
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
                            <p><a class="nav-link" href="#" target="_blank"><i class="bi bi-github"></i> Sitio publico</a></p>
                            <p><i class="bi bi-envelope-fill"></i> ricardo@gmail.com</p>
                        </div>
                    </nav>
                </footer>
            `);
        } else {
            location.href = 'index.html';
        }
    }
}
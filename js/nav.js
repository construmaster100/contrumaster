(function () {
    var page = location.pathname.split('/').pop() || 'index.html';
    if (page === '') page = 'index.html';

    function act(p) { return page === p ? ' cf-active' : ''; }

    var html = '\
<header class="cf-topbar">\
  <div class="cf-topbar-inner">\
    <a href="index.html" class="cf-logo-link">\
      <img src="img/Logo.JPG" alt="COMFER - Unidos Construimos" class="cf-topbar-logo">\
    </a>\
    <div class="cf-topsearch">\
      <input type="text" id="topSearchInput" class="cf-ts-input"\
             placeholder="\xBFQu\xE9 est\xE1s buscando?"\
             onkeydown="if(event.key===\'Enter\')irACatalogo(this.value)">\
      <button class="cf-ts-cam" title="Buscar por imagen">\
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">\
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>\
          <circle cx="12" cy="13" r="4"/>\
        </svg>\
      </button>\
      <button class="cf-ts-btn" title="Buscar"\
              onclick="irACatalogo(document.getElementById(\'topSearchInput\').value)">\
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\
          <circle cx="11" cy="11" r="8"/>\
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>\
        </svg>\
      </button>\
    </div>\
    <a href="#" class="cf-nav-location">\
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>\
        <circle cx="12" cy="10" r="3"/>\
      </svg>\
      <span>Ingresa tu<br><strong>ubicaci\xF3n</strong></span>\
    </a>\
    <a href="#" class="cf-nav-cart" onclick="event.preventDefault();typeof cfOpenCart===\'function\'&&cfOpenCart()">\
      <div class="cf-cart-count" id="navCartCount">0</div>\
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>\
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>\
      </svg>\
      <span>Carrito de<br>compras</span>\
    </a>\
    <a href="#" class="cf-nav-account">\
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>\
        <circle cx="12" cy="7" r="4"/>\
      </svg>\
      <span>Mi Cuenta</span>\
    </a>\
  </div>\
</header>\
<nav class="cf-orange-nav">\
  <div class="cf-orange-nav-inner">\
    <a href="index.html" class="cf-onav-item' + act('index.html') + '">INICIO</a>\
    <a href="catalogo.html" class="cf-onav-item' + act('catalogo.html') + '">Cat\xE1logo</a>\
    <a href="materiales.html" class="cf-onav-item' + act('materiales.html') + '">Materiales de construcci\xF3n</a>\
    <a href="remodelacion.html" class="cf-onav-item' + act('remodelacion.html') + '">Remodelaci\xF3n</a>\
    <a href="presupuesto.html" class="cf-onav-item' + act('presupuesto.html') + '">Presupuesto de obra</a>\
    <a href="promocion.html" class="cf-onav-item' + act('promocion.html') + '">Promoci\xF3n</a>\
  </div>\
</nav>';

    document.currentScript.insertAdjacentHTML('beforebegin', html);

    /* Navegar al catálogo con búsqueda */
    window.irACatalogo = function (q) {
        var url = 'catalogo.html';
        if (q && q.trim()) url += '?q=' + encodeURIComponent(q.trim());
        window.location.href = url;
    };

    /* Leer parámetro q en catalogo.html y pre-rellenar input */
    window.addEventListener('DOMContentLoaded', function () {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
            var inp = document.getElementById('topSearchInput');
            if (inp) inp.value = q;
            if (typeof filtrarCatalogo === 'function') filtrarCatalogo(q);
        }

        /* Sincronizar carrito desde localStorage */
        var count = parseInt(localStorage.getItem('cfCartCount') || '0');
        var badge = document.getElementById('navCartCount');
        if (badge) badge.textContent = count;
    });
})();

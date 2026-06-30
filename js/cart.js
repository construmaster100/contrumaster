(function () {
    /* ─────── ESTADO ─────── */
    var STORE_KEY = 'cfCart';

    function loadCart() {
        try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
        catch (e) { return []; }
    }

    function saveCart(items) {
        localStorage.setItem(STORE_KEY, JSON.stringify(items));
        var total = items.reduce(function (s, i) { return s + i.qty; }, 0);
        localStorage.setItem('cfCartCount', total);
        var badge = document.getElementById('navCartCount');
        if (badge) badge.textContent = total;
        var dbadge = document.getElementById('drawerCartCount');
        if (dbadge) dbadge.textContent = total;
    }

    /* ─────── HTML ─────── */
    var cartSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';

    var ui = '\
<div class="cart-overlay" id="cartOverlay"></div>\
<div class="cart-drawer" id="cartDrawer">\
  <div class="cart-drawer-header">\
    <div class="cart-drawer-title">' + cartSVG + ' CARRITO <span class="cart-count-badge" id="drawerCartCount">0</span></div>\
    <button class="cart-close-btn" onclick="cfCloseCart()">&#x2715;</button>\
  </div>\
  <div class="cart-items-list" id="cartItemsList"></div>\
  <div class="cart-drawer-footer">\
    <div class="cart-subtotal">\
      <span class="cart-subtotal-label">SUBTOTAL</span>\
      <span class="cart-subtotal-val" id="cartSubtotal">$0</span>\
    </div>\
    <p class="cart-subtotal-hint">Envi&#x00F3; calculado al finalizar</p>\
    <button class="btn-pagar" id="btnPagar" onclick="cfOpenNequi()">PAGAR CON NEQUI</button>\
  </div>\
</div>';

    /* ─────── RENDER ─────── */
    function renderCart() {
        var items = loadCart();
        var list = document.getElementById('cartItemsList');
        var subtotalEl = document.getElementById('cartSubtotal');
        var btnPagar = document.getElementById('btnPagar');
        var dbadge = document.getElementById('drawerCartCount');
        if (!list) return;

        var total = items.reduce(function (s, i) { return s + i.qty; }, 0);
        if (dbadge) dbadge.textContent = total;

        var sub = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
        if (subtotalEl) subtotalEl.textContent = '$' + sub.toLocaleString('es-CO');
        if (btnPagar) btnPagar.disabled = (items.length === 0);

        if (items.length === 0) {
            list.innerHTML = '<div class="cart-empty">' + cartSVG + '<p>Tu carrito est&#xE1; vac&#xED;o</p></div>';
            return;
        }

        list.innerHTML = items.map(function (item) {
            var displayName = item.name.length > 60 ? item.name.substring(0, 60) + '…' : item.name;
            return '<div class="cart-item">' +
                '<div class="cart-item-emoji">' + item.emoji + '</div>' +
                '<div class="cart-item-info">' +
                  '<p class="cart-item-brand">' + item.brand + '</p>' +
                  '<p class="cart-item-name">' + displayName + '</p>' +
                  '<div class="cart-item-controls">' +
                    '<button class="qty-btn" onclick="cfUpdateQty(\'' + item.id + '\',-1)">&#x2212;</button>' +
                    '<span class="qty-val">' + item.qty + '</span>' +
                    '<button class="qty-btn" onclick="cfUpdateQty(\'' + item.id + '\',1)">+</button>' +
                  '</div>' +
                '</div>' +
                '<div class="cart-item-price">' +
                  '<span class="cart-item-price-val">$' + (item.price * item.qty).toLocaleString('es-CO') + '</span>' +
                  '<button class="cart-item-remove" onclick="cfRemoveFromCart(\'' + item.id + '\')">Eliminar</button>' +
                '</div>' +
              '</div>';
        }).join('');
    }

    /* ─────── API PÚBLICA ─────── */
    window.cfOpenCart = function () {
        document.getElementById('cartDrawer').classList.add('open');
        document.getElementById('cartOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.cfCloseCart = function () {
        document.getElementById('cartDrawer').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
    };

    window.cfAddToCart = function (id, brand, name, price, emoji) {
        var items = loadCart();
        var ex = null;
        for (var k = 0; k < items.length; k++) if (items[k].id === id) { ex = items[k]; break; }
        if (ex) { ex.qty++; } else { items.push({ id: id, brand: brand, name: name, price: price, emoji: emoji, qty: 1 }); }
        saveCart(items);
        renderCart();
        cfOpenCart();
    };

    window.cfUpdateQty = function (id, delta) {
        var items = loadCart();
        for (var k = 0; k < items.length; k++) {
            if (items[k].id === id) {
                items[k].qty = Math.max(0, items[k].qty + delta);
                if (items[k].qty === 0) items.splice(k, 1);
                break;
            }
        }
        saveCart(items);
        renderCart();
    };

    window.cfRemoveFromCart = function (id) {
        var items = loadCart().filter(function (i) { return i.id !== id; });
        saveCart(items);
        renderCart();
    };

    /* ─────── NEQUI – navega a página de pago ─────── */
    window.cfOpenNequi = function () {
        var items = loadCart();
        var sub = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
        window.location.href = 'pago-nequi.html?total=' + sub;
    };

    /* ─────── INIT ─────── */
    document.addEventListener('DOMContentLoaded', function () {
        document.body.insertAdjacentHTML('beforeend', ui);
        document.getElementById('cartOverlay').addEventListener('click', cfCloseCart);
        renderCart();

        var items = loadCart();
        var total = items.reduce(function (s, i) { return s + i.qty; }, 0);
        var badge = document.getElementById('navCartCount');
        if (badge) badge.textContent = total;
    });

})();

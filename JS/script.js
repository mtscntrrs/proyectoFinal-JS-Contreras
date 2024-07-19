$(document).ready(function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Cargar desde JSON utilizando fetch
    fetch('./JS/products.json')
        .then(response => response.json())
        .then(products => {
            renderProducts(products);
        })
        .catch(error => console.error('Error al cargar productos:', error));

    const renderProducts = (products) => {
        const $products = $('#products');
        $products.empty();
        products.forEach(product => {
            const $productDiv = $(`
                <div class="product">
                    <span>${product.name} - $${product.price}</span>
                    <button data-id="${product.id}" class="add-to-cart-btn">Agregar al Carrito</button>
                </div>
            `);
            $products.append($productDiv);
        });

        $('.add-to-cart-btn').on('click', function () {
            const productId = $(this).data('id');
            const product = products.find(p => p.id === productId);
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    };

    const renderCart = () => {
        const $cartItems = $('#cart-items');
        $cartItems.empty();
        cart.forEach((item, index) => {
            const $cartItemDiv = $(`
                <div class="cart-item">
                    <span>${item.name} - $${item.price}</span>
                    <button data-index="${index}" class="remove-from-cart-btn">Eliminar</button>
                </div>
            `);
            $cartItems.append($cartItemDiv);
        });
        const totalPrice = cart.reduce((total, item) => total + item.price, 0);
        $('#total-price').text(totalPrice);

        $('.remove-from-cart-btn').on('click', function () {
            const itemIndex = $(this).data('index');
            cart.splice(itemIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });
    };

    const simulatePurchase = () => {
        const $resultSection = $('#result-section');
        $resultSection.html('<p>Procesando compra...</p>');
        fetch('./JS/purchase.json')
            .then(response => response.json())
            .then(result => {
                $resultSection.html(`<p>Resultado: ${result.message}</p>`);
                cart.length = 0;
                localStorage.removeItem('cart');
                renderCart();
            })
            .catch(error => {
                $resultSection.html('<p>Error: No se pudo procesar la compra</p>');
                console.error('Error al procesar la compra:', error);
            });
    };

    $('#checkout-btn').on('click', simulatePurchase);

    // formulario de contacto
    $('#contact-form').on('submit', function (event) {
        event.preventDefault();
        const name = $('#name').val();
        const email = $('#email').val();
        const message = $('#message').val();

        alert(`Gracias por contactarnos, ${name}. Hemos recibido tu mensaje.`);

        // Resetear el formulario
        $(this).trigger('reset');
    });

    // Renderizar el carrito
    renderCart();
});

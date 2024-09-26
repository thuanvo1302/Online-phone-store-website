$(function () {


    $(`#modal--success`).modal(`show`)

    function showLoader() {
        $('.loadding-page').show();
    }

    function hideLoader() {
        $('.loadding-page').hide();
    }



    let params = new URLSearchParams(window.location.search);
    let categoryName = params.get('category') || '';

    function handleUi() {
        $("#items").height(552);
        $("#items").overlayScrollbars({
            overflowBehavior: {
                x: "hidden",
                y: "scroll",
            },
        });
        $("#cart").height(445);
        $("#cart").overlayScrollbars({});
    }
    async function fetchData() {
        let apiCategory = `/api/categories`;
        let apiProduct = `/api/products?category=${categoryName}`;
        try {
            $(".loading-page").show();
            const [categoriesResponse, productsResponse] = await Promise.all([
                axios.get(`${apiCategory}`),
                axios.get(`${apiProduct}`)
            ]);

            if (categoriesResponse.status === 200) {
                const categoryList = $('#categoryList');
                const data = categoriesResponse.data;
                data.forEach(category => {
                    const listItem = $('<li>').addClass('nav-item');
                    const link = $('<a>')
                        .addClass('nav-link').attr('data-toggle', 'pill')
                        .html(`<i class="fa fa-tags"></i> ${category.name}`);
                    listItem.append(link);
                    categoryList.append(listItem);

                    link.click(e => {

                        updateQueryParam('category', category.name)

                        axios.get(`/api/products?category=${category.name}`)
                            .then(res => {
                                if (res.status === 200) {
                                    displayProducts(res.data.data);
                                }
                            })
                            .catch(err => console.log(err))
                    })
                })
            }
            if (productsResponse.status === 200) {
                displayProducts(productsResponse.data.data);
            }

            hideLoader();

        } catch (err) {
            console.log(err);
        }
    }
    function updateQueryParam(key, value) {
        if (history && history.pushState) {
            const params = new URLSearchParams(window.location.search);
            params.set(key, value);
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            history.pushState({ path: newUrl }, '', newUrl);
        } else {
            console.warn('Lịch sử trình duyệt không được hỗ trợ.');
        }
    }
    function displayProducts(products) {
        const productList = $('#product');
        $(`#product`).html(``);
        products.forEach(product => {
            let item = $(`<div class="col-md-3">
                <figure class="card card-product">
                    <span class="badge-new"> NEW </span>
                    <div class="img-wrap">
                        <img src="/images/product/${product.images}" />
                        <a class="btn-overlay" href="#"><i class="fa fa-search-plus"></i> Quick view</a>
                    </div>
                    <figcaption class="info-wrap">
                        <a href="#" class="title">${product.productName}</a>
                        <div class="action-wrap">
                            <a class="btn btn-primary btn-sm float-right btnadd">
                                <i class="fa fa-cart-plus"></i> Add
                            </a>
                            <div class="price-wrap h5">
                                <span class="price-new">${formatCurrency(product.retailPrice)}</span>
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </div>`);
            productList.append(item);

            const addToCartButton = item.find('.action-wrap .btnadd');
            addToCartButton.click(async (evt) => {
                evt.preventDefault();
                $(`#modal-success`).modal('show');
                setTimeout(function () {
                    $('#modal-success').modal('hide');
                }, 500);
                await addToCart(product._id, 1)
            });


        });
    }

    async function getCart() {
        try {
            const response = await axios.get('/api/cart');
            const data = response.data;
            if (response.status === 200 && data) {
                const { sessionId, cartData } = data.data;
                console.log('Cart information:', { sessionId, cartData });

                let totalCartValue = 0

                for (const productId in cartData) {
                    const quantity = cartData[productId];
                    const productData = await getProductById(productId);

                    const existingRow = $(`#cart-items tr[data-product-id="${productId}"]`);

                    if (existingRow.length > 0) {
                        const quantityCell = existingRow.find('.quantity');
                        quantityCell.text(quantity);

                        const totalCell = existingRow.find('.total');
                        const totalPrice = quantity * productData.retailPrice;
                        totalCell.text(`${formatCurrency(totalPrice)}`);

                        totalCartValue += quantity * productData.retailPrice;

                    }
                    else {
                        let item = $(`<tr data-product-id="${productId}">
                        <td>
                            <figure class="media">
                                <div class="img-wrap">
                                    <img src="/images/product/${productData.images}" class="img-thumbnail img-xs" />
                                </div>
                                <figcaption class="media-body">
                                    <h6 class="title text-truncate">${productData.productName}</h6>
                                </figcaption>
                            </figure>
                        </td>
                        <td class="text-center">
                            <div class="m-btn-group m-btn-group--pill btn-group mr-2" role="group"
                                aria-label="...">
                                <button type="button" class="m-btn btn btn-default btn-minus">
                                    <i class="fa fa-minus"></i>
                                </button>
                                <button type="button" class="m-btn btn btn-default quantity">${quantity}</button>
                                <button type="button" class="m-btn btn btn-default btn-plus">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                        </td>
                        <td>
                            <div class="price-wrap">
                                <var class="price">${formatCurrency(productData.retailPrice)}</var>
                            </div>
                        </td>
                        <td>
                            <div class="price-wrap">
                                <var class="total">$${formatCurrency(quantity * productData.retailPrice)}</var>
                            </div>
                        </td>
                        <td class="text-right">
                            <button class="btn btn-outline-danger btn-round btn-delete" data-toggle="modal" data-target="#deleteConfirmationModal">
                                <i class="fa fa-trash"></i></button>
                        </td>
                    </tr>`)
                        $(`#cart-items`).append(item);

                        item.find('.btn-plus').on('click', async (e) => {
                            $(`#modal-success`).modal('show');
                            $(`#modal-success .modal-body`).html(`Add success`)
                            setTimeout(function () {
                                $('#modal-success').modal('hide');
                            }, 500);
                            await addToCart(productData._id, 1)
                        })

                        item.find('.btn-minus').on('click', async (e) => {
                            try {
                                const row = $(e.target).closest('tr');
                                let currentQuantity = parseInt(row.find('.quantity').text());

                                $(`#modal-success`).modal('show');

                                if (currentQuantity > 1) {
                                    currentQuantity--;
                                    await updateToCart(productData._id, currentQuantity);
                                }
                                else if (currentQuantity === 1) {
                                    await deleteToCart(productData._id);
                                }

                                $(`#modal-success .modal-body`).html(`Delete product success`)
                                setTimeout(function () {
                                    $('#modal-success').modal('hide');
                                }, 500);

                            } catch (error) {
                                console.error('Error updating cart:', error.message);
                            }
                        })

                        item.find('.btn-delete').on('click', async (e) => {
                            e.preventDefault();
                            $('#confirmDeleteButton').on('click', async (e) => {
                                await deleteToCart(productData._id);
                                $('#deleteConfirmationModal').modal('hide');
                            })
                        })

                        totalCartValue += quantity * productData.retailPrice;
                    }
                }
                const formattedTotal = formatCurrency(totalCartValue);
                $('#total-cart-value').text(`${formattedTotal}`);

            } else {
                console.error('Failed to get cart information:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error getting cart information:', error.message);
        }
    }

    async function addToCart(productId, quantity) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity,
                }),
            });

            const data = await response.json();
            if (data.success) {
                getCart();
                $('#modal-success').modal('hide');
            } else {
                // alert(`Failed to add product to cart: ${data.message}`)
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    }

    async function deleteToCart(productId) {
        try {
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                getCart();
                const rowToRemove = $(`#cart-items tr[data-product-id="${productId}"]`);
                rowToRemove.remove();
            } else {
                //alert(`Failed to Delete product to cart: ${data.message}`)
            }
        } catch (error) {
            console.error('Error Delete product to cart:', error);
        }
    }

    async function updateToCart(productId, quantity) {
        try {
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantity: quantity,
                }),
            });

            const data = await response.json();

            if (data.success) {
                getCart();
            } else {
            }
        } catch (error) {
            console.error('Error update product to cart:', error);
        }
    }

    async function getProductById(productId) {
        try {
            const response = await axios.get(`/api/products/${productId}`);
            const data = response.data;

            if (response.status === 200 && data) {
                const productData = data.data;
                //console.log('Product information:', productData);
                return productData;
            } else {
                console.error('Failed to get product information:', data.message || 'Unknown error');
                return null;
            }
        } catch (error) {
            console.error('Error getting product information:', error.message);
            return null;
        }
    }

    handleUi();

    fetchData();
    getCart();

    // convert to VND
    function formatCurrency(amount) {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        return formatter.format(amount);
    }

    // handle search keyword by name
    $('#search').on('submit', e => {
        e.preventDefault();
        const searchTerm = $("#nameProduct").val();
        axios.get(`/api/products?name=${searchTerm}`)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data.data;
                    displayProducts(data);
                    $("#nameProduct").val(``);
                }
            })
            .catch(err => {
                console.log(err)
            })
    })

    // handle checkout 
    $(`#checkout`).on("click", e => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to proceed to checkout?");

        axios.post('/checkout')
            .then(res => {
                if (res.data.success) {
                    window.location.href = `/checkout`;
                }
            })
            .catch(error => {
                const data = error.response.data;
                alert(`An error occurred during the checkout process. Because: ${data.message}`);
                window.location.href = `/login`;
            });
    })

    $(`#formSearchBarcode`).on('submit', e => {
        e.preventDefault();
        const form = e.currentTarget;
        const fileInput = form.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const barcodeProduct = reader.result;

            axios.post(`/api/products/search/barcode`, { barcodeProduct })
                .then(res => {
                    if (res.status === 200) {
                        displayProducts(res.data.data);
                        alert('Tìm sản phẩm theo barcode thành công');
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };

    })

});     
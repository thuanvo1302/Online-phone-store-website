$(function () {
    let total;
    let customer;
    let cart;
    // get cart in sesseion server  
    async function getCart() {
        try {
            const response = await axios.get('/api/cart');
            const data = response.data;
            if (response.status === 200 && data) {
                const { sessionId, cartData } = data.data;

                cart = cartData;

                console.log('Cart information:', { sessionId, cartData });
                if (Object.keys(cartData).length === 0) {
                    alert('Vui long chon san pham')
                    window.location.href = `/sale`;
                }
                let totalCartValue = 0

                for (const productId in cartData) {
                    const quantity = cartData[productId];
                    const productData = await getProductById(productId);
                    let item = $(`<tr>
                    <th scope="row"><img
                            src="/images/product/${productData.images}"
                            alt="product-img" title="product-img" class="avatar-lg rounded">
                    </th>
                    <td>
                        <h5 class="font-size-16 text-truncate"><a href="#"
                                class="text-dark">${productData.productName}</a></h5>
                        <p class="text-muted mb-0 mt-1">${formatCurrency(productData.retailPrice)} x ${quantity} </p>
                    </td>
                    <td> ${formatCurrency(productData.retailPrice * quantity)}</td>
                </tr>`);
                    $(`#tbody`).append(item)
                    totalCartValue += quantity * productData.retailPrice;
                    total = totalCartValue;
                }

                let info = $(`<tr>
                    <td colspan="2">
                        <h5 class="font-size-14 m-0">Sub Total :</h5>
                    </td>
                    <td>
                    ${formatCurrency(totalCartValue)}
                    </td>
                </tr>
                <tr class="bg-light">
                    <td colspan="2">
                        <h5 class="font-size-14 m-0" >Total:</h5>
                    </td>
                    <td>
                    ${formatCurrency(totalCartValue)}
                    </td>
                </tr>`)

                $(`#tbody`).append(info)


            } else {
                console.error('Failed to get cart information:', data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error getting cart information:', error.message);
        }
    }
    getCart();

    // find product by id 
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

    // convert to VND
    function formatCurrency(amount) {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        return formatter.format(amount);
    }

    // handle find customer
    $('#billing-phone').on('blur', async function () {
        const inputPhone = $(this).val();

        await axios.get(`/api/customers/phone/${inputPhone}`)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data.data;
                    $(`#billing-name`).val(data.fullname);
                    $(`#billing-address`).val(data.address);
                    customer = res.data;
                }
            })
            .catch(err => {
                alert('Không tìm thấy khách hàng. Vui lòng nhập thông tin để tạo khách hàng mới.');
                $(`#billing-name`).val(``);
                $(`#billing-address`).val(``);
            })

    });

    // handle amount received
    $('#amountReceived').on('blur', function () {
        const amountReceived = $(this).val();
        $(`#amountgiven`).html(formatCurrency(amountReceived));

        if (Number(amountReceived) < total) {
            alert('Please enter amountReceived >= total')
            $('#amountgiven').html(`0₫`)
            $(`#amountReceived`).val(``);
            $('#amountback').html(`0₫`);
            return;
        }

        let receivesBack = Number(amountReceived) - Number(total);
        $('#amountback').html(formatCurrency(receivesBack));
    });


    // handle payment
    $(`#payment`).on('click', async (e) => {
        e.preventDefault();

        if (!cart) {
            alert('Vui lòng chọn sản phẩm');
            window.location.href = `/sale`;
        }

        if (!customer) {
            let phone = $(`#billing-phone`).val();
            let fullname = $(`#billing-name`).val();
            let address = $(`#billing-address`).val();
            if (!phone || !fullname || !address) {
                alert(`Vui lòng nhập đủ thông tin khách hàng`);
            }
            else {
                await createCustomer({
                    phoneNumber: phone,
                    fullname,
                    address
                })

                    .then(savedCustomer => {
                        console.log("success");
                        customer = savedCustomer;
                    })
                    .catch(err => {
                        console.error(err);
                    })
            }
        }

        // console.log(customer)

        let amountGivenByCustomer = $(`#amountReceived`).val();
        let customerId = customer.data._id;

        axios.post(`/orders/payment`, {
            customerId,
            amountGivenByCustomer
        })
            .then(res => {
                if (res.status === 200) {
                    alert('Đơn hàng tạo thành công!');

                    const data = res.data.data;

                    window.location.href = `/payment?idOrder=${data.savedOrder._id}`;
                }
            })
            .catch(err => {
                console.error(err);
            })
    })

    // handle create customer 
    async function createCustomer(customer) {
        try {
            console.log(customer)
            const response = await axios.post('/api/customers', customer);
            if (response.status === 201) {
                console.log('Customer created successfully:', response.data);
                return response.data;
            } else {
                console.error('Failed to create customer:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    }
})
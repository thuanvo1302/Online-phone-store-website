$(function () {
    const idOrder = new URLSearchParams(window.location.search).get('idOrder');
    if (!idOrder) {
        window.location.href = `/`;
    }

    axios.get(`/orders/${idOrder}`)
        .then(async res => {
            const data = res.data.data;
            let total = 0;
            const dataCustomer = data.customerId;
            const dateOfPurchase = new Date(data.dateOfPurchase);

            const formattedDate = dateOfPurchase.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });

            let customer = $(`<div class="col invoice-to">
                                <div class="text-gray-light">INVOICE TO:</div>
                                <h2 class="to">${dataCustomer.fullname}</h2>
                                <div class="address">Address:${dataCustomer.address}</div>
                                <div class="phone">Phone Number:${dataCustomer.phoneNumber}
                                </div>
                            </div>
                            <div class="col invoice-details">
                                <h1 class="invoice-id">INVOICE ${data._id}</h1>
                                <div class="date">Date of Invoice:${formattedDate}</div>
                            </div>`)

            $(`#infocustomer`).append(customer);

            for (let index = 0; index < data.orderDetails.length; index++) {
                const orderDetail = data.orderDetails[index];

                const productRes = await axios.get(`/api/products/${orderDetail.productId}`);
                const productData = productRes.data.data;

                let item = $(`<tr>
                <td class="no">${index + 1}</td>
                <td class="text-left">
                    <h3>
                        <a target="_blank" href="javascript:;">
                            Product: ${productData.productName}
                        </a>
                    </h3>
                    <a target="_blank" href="javascript:;">
                        Quantity: ${orderDetail.quantity}
                    </a>
                </td>
                <td class="unit">${orderDetail.unitPrice}</td>
                <td class="qty">${orderDetail.quantity}</td>
                <td class="total">${orderDetail.totalPrice}</td>
                </tr>`);
                $(`#tbody`).append(item);

                total += Number(orderDetail.quantity) * Number(orderDetail.totalPrice);

            }
            $(`#tfoot`).append(
                $(`<tr>
                        <td colspan="2"></td>
                        <td colspan="2">TOTAL</td>
                        <td>${total}</td>
                    </tr>`)
            )
        })

    $(`.btnExport`).on('click', e => {
        e.preventDefault();
        window.location.href = `/orders/file/generate-pdf/${idOrder}`
    })
})

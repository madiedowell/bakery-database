// This file was adapated from the starter code.

let updateOrderForm = document.getElementById('UpdateOrder');

updateOrderForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let link = '/put-order-ajax/';
    let data = {
        orderID: document.getElementById("input-update-orderID").value,
        customerID: document.getElementById("input-update-customerID").value,
        orderDate: document.getElementById("input-update-orderDate").value
    }
    
    $.ajax({
        url: link,
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            location.reload();
        }
    });
});

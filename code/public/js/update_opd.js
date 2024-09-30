// This file was adapated from the starter code.

let updateOpdForm = document.getElementById('update-opd-form-ajax');

updateOpdForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let link = '/put-opd-ajax/';
    let data = {
        orderID: document.getElementById("input-orderid-update").value,
        productID: document.getElementById("input-productid-update").value,
        quantity: document.getElementById("input-quantity-update").value
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

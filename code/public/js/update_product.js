// This file was adapated from the starter code.

let updateProductForm = document.getElementById('UpdateProduct');

updateProductForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let link = '/put-product-ajax/';
    let data = {
        productID: document.getElementById("input-update-productID").value,
        productName: document.getElementById("input-update-productName").value,
        description: document.getElementById("input-update-description").value,
        price: document.getElementById("input-update-price").value,
        inventory: document.getElementById("input-update-inventory").value
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
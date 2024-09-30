// This file was adapated from the starter code.

let updateSupplierForm = document.getElementById('UpdateSupplier');

updateSupplierForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let link = '/put-supplier-ajax/';
    let data = {
        supplierID: document.getElementById("input-update-supplierID").value,
        companyName: document.getElementById("input-update-supplierName").value,
        email: document.getElementById("input-update-email").value,
        phone: document.getElementById("input-update-phone").value,
        address: document.getElementById("input-update-address").value
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
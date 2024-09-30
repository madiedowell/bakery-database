// This file was adapated from the starter code.

let updateCustomerForm = document.getElementById('UpdateCustomer');

updateCustomerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let link = '/put-customer-ajax/';
    let data = {
        customerID: document.getElementById("updateCustomerID").value,
        firstName: document.getElementById("updateFirstName").value,
        lastName: document.getElementById("updateLastName").value,
        email: document.getElementById("updateEmail").value,
        phone: document.getElementById("updatePhone").value,
        address: document.getElementById("updateAddress").value,
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

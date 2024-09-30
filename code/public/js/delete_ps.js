// This file was adapated from the starter code.

function deletePs(productID, supplierID) {
  let link = '/delete-ps-ajax/';
  let data = {
    productID: productID,
    supplierID: supplierID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
        location.reload();
    }
  });
}

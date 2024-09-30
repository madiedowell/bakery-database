// This file was adapated from the starter code.

function deleteOpd(orderID, productID) {
  let link = '/delete-opd-ajax/';
  let data = {
    orderID: orderID,
    productID: productID
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

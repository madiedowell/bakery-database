// This file was adapated from the starter code.

function deleteOrder(orderID) {
    let link = '/delete-order-ajax/';
    let data = {
      orderID: orderID
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
  
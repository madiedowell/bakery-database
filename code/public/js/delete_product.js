// This file was adapated from the starter code.

function deleteProduct(productID) {
    let link = '/delete-product-ajax/';
    let data = {
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
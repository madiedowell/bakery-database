// This file was adapated from the starter code.

function deleteSupplier(supplierID) {
    let link = '/delete-supplier-ajax/';
    let data = {
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
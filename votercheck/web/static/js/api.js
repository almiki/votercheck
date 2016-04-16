
var Api = function() {
  this.search = function(queryString, callback) {
    var request = $.ajax({
      url: "/voters/" + encodeURIComponent(queryString),
      method: "GET",
      error: function(a, b, c) {
        callback();
      },
      success: function(data) {
        callback(data);
      }
    });
    return request;
  }
};

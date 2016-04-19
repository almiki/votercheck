var Api = function() {
  this.search = function(searchInfo, callback) {

    var zeroPad = function(numStr, requiredLength) {
      numStr = numStr || "";

      while (numStr.length < requiredLength) {
        numStr = "0" + numStr;
      }
      return numStr;
    };

    var queryString = "/voterapi/search";

    queryString += "/" + encodeURIComponent(searchInfo.last || " ");
    queryString += "/" + encodeURIComponent(searchInfo.first || " ");
    queryString += "/" + encodeURIComponent(searchInfo.middle || " ");
    queryString += "/" + encodeURIComponent(searchInfo.zip || " ");
    queryString += "/" + encodeURIComponent(searchInfo.year + zeroPad(searchInfo.month, 2) + zeroPad(searchInfo.day, 2));

    var request = $.ajax({
      url: queryString,
      method: "GET",
      error: function() {
        callback();
      },
      success: function(data) {
        callback(data);
      }
    });
    return request;
  }
};

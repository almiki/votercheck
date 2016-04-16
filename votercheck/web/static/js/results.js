
var Results = function(resultsElement) {
  resultsElement.html('');
  resultsElement.text("Searching...");

  this.showResults = function(resultDatas) {
    resultsElement.html('');

    if (!resultDatas.matches) {
      this.showError();
      return;
    }

    if (resultDatas.matches.length == 0) {
      resultsElement.text('No matches for "' + resultDatas.query + '"');
      return;
    }


    var fields = [['last_name', 'Last Name'],
                  ['middle_name', 'M'],
                  ['first_name', 'First Name'],
                  ['dob', "Date of Birth"],
                  ['zip', 'Zip Code'],
                  ['status', 'Status'],
                  ['party', 'Party'],
                  ['application_date', 'App Date'],
                  ['application_source', 'App Source']];

    var header = $('<div class="result-header"></div>');
    fields.forEach(function(i) {
      var field = $('<div class="result-field"/>');
      field.text(i[1]);
      field.addClass(i[0]);
      header.append(field);
    });
    resultsElement.append(header);

    var isOdd = false;

    resultDatas.matches.forEach(function(data) {
      var resultDiv = $('<div class="result"></div>')
      resultDiv.addClass(isOdd ? 'odd' : 'even');
      isOdd = !isOdd;

      fields.forEach(function(i) {
        var field = $('<div class="result-field"/>');
        field.addClass(i[0]);
        var span = $('<span/>');
        span.attr('title', i[1] + ': ' + data[i[0]]);
        span.text(data[i[0]]);
        field.append(span);
        resultDiv.append(field);
      });
      resultsElement.append(resultDiv);
    });
  };

  this.showError = function() {
    resultsElement.text("Error");
  };
};

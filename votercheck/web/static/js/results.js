
var Results = function(resultsElement) {
  resultsElement.html('');
  resultsElement.html("<p>Searching...</p>");

  this.showResults = function(resultDatas, searchInfo) {
    resultsElement.html('');

    if (!resultDatas.matches) {
      this.showError();
      return;
    }

    var appendHelpText = function() {
      var p = $('<p><i></i></p>');
      p.find('i').text("If your voter registration has been changed without your approval, you can still vote. There will be a judge on April 19th granting disenfranchised voters the right to vote.  Screenshot this page and use it as evidence in addition to other evidence gathered. If you are not granted an official ballot, it is very important that you cast a provisional ballot.");
      resultsElement.append(p);
    };

    if (resultDatas.matches.length == 0) {
      var searchText = '';
      searchText += searchInfo.first;
      if (searchInfo.middle) {
        searchText += " " + searchInfo.middle;
      }
      searchText += " " + searchInfo.last;
      searchText += ", " + searchInfo.zip;
      searchText += ", " + searchInfo.year + "/" + searchInfo.month + "/" + searchInfo.day;

      var p = $("<p/>");
      p.text('No matches found for "' + searchText + '".');
      resultsElement.append(p);
      appendHelpText();
      return;
    }

    var fields = [['last_name', 'Last Name'],
                  ['middle_name', 'M'],
                  ['first_name', 'First Name'],
                  ['zip', 'Zip Code'],
                  ['status', 'Status'],
                  ['status_why', 'Status Reason'],
                  ['purged', 'Purged Date', 'date'],
                  ['inactive', 'Inactive Date', 'date']];

    var header = $('<div class="result-header"></div>');
    fields.forEach(function(i) {
      var field = $('<div class="result-field"/>');
      field.text(i[1]);
      field.addClass(i[0]);
      for (var extra = 2; extra < i.length; extra++) {
        field.addClass(i[extra]);
      }
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

        for (var extra = 2; extra < i.length; extra++) {
          field.addClass(i[extra]);
        }

        var span = $('<span/>');
        span.attr('title', i[1] + ': ' + data[i[0]]);
        span.text(data[i[0]]);
        field.append(span);
        resultDiv.append(field);
      });
      resultsElement.append(resultDiv);
    });

    if (resultDatas.count > resultDatas.matches.length) {
      var resultDiv = $('<div class="result"></div>')
      resultDiv.text("Showing " + resultDatas.matches.length + " / " + resultDatas.count);
      resultsElement.append(resultDiv);
      var disclaimerDiv = $('<div class="result"></div>')
      disclaimerDiv.text("If your voter registration has been changed without your approval, you can still vote. There will be a judge on April 19th granting disenfranchised voters the right to vote.  Screenshot this page and use it as evidence in addition to other evidence gathered. If you are not granted an official ballot, it is very important that you cast a provisional ballot.");
      resultsElement.append(disclaimerDiv);
    }

    appendHelpText();
  };

  this.showError = function(error) {
    var p = $('<p/>');
    p.text(error || "Error");
    resultsElement.html('');
    resultsElement.append(p);
  };
};

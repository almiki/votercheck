var Searcher = function(searchBarElement, callback) {
  var textBoxes = searchBarElement.find('input');
  var button = searchBarElement.find('button');

  var isNumeric = function(s) {
    return /^[0-9]+$/.test(s);
  };

  var clicked = function() {
    var info = {
      first: searchBarElement.find('input.first').val(),
      middle: searchBarElement.find('input.middle').val(),
      last: searchBarElement.find('input.last').val(),

      zip: searchBarElement.find('input.zip').val(),

      year: searchBarElement.find('input.year').val(),
      month: searchBarElement.find('select.month').val(),
      day: searchBarElement.find('input.day').val()
    };

    var errors = [];
    if (!info.first) {
      errors.push("first name");
    }

    if (!info.last) {
      errors.push("last name");
    }

    if (info.zip.length != 5 || !isNumeric(info.zip)) {
      errors.push("valid 5-digit zip code");
    }

    if (info.year.length != 4 || !isNumeric(info.year)) {
      errors.push("valid 4-digit birth year");
    }

    if (info.day.length == 0 || !isNumeric(info.day) || parseInt(info.day) < 1 || parseInt(info.day) > 31) {
      errors.push("valid day of the month");
    }

    if (errors.length > 0) {
      info.errors = "Please enter a ";

      for (var i = 0; i < errors.length; i++) {
        info.errors += errors[i];

        if (i + 2 == errors.length) {
          if (errors.length == 2) {
            info.errors += " and a ";
          }
          else {
            info.errors += ", and a ";
          }
        }
        else if (i + 1 < errors.length) {
          info.errors += ", ";
        }
      }

      info.errors += ".";
    }

    callback(info);
  };

  button.click(clicked);

  textBoxes.keypress(function(e) {
    if (e.which == 13) { //enter
      clicked();
    }
  });
};

var Searcher = function(searchBarElement, callback) {
  var textBoxes = searchBarElement.find('input');
  var button = searchBarElement.find('button');

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

    callback(info);
  };

  button.click(clicked);

  textBoxes.keypress(function(e) {
    if (e.which == 13) { //enter
      clicked();
    }
  });
};

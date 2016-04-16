var Searcher = function(searchBarElement, callback) {
  var textBox = searchBarElement.find('input');
  var button = searchBarElement.find('button');

  var clicked = function() {
    var text = textBox.val();
    callback(text);
  };

  button.click(clicked);

  textBox.keypress(function(e) {
    if (e.which == 13) { //enter
      clicked();
    }
  });
};

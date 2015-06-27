var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.info("mongodb connected.");
});

var Book = mongoose.model('Book', { name: String });

var practicalNodeBook = new Book({ name: 'Practical Node.js' });
practicalNodeBook.save(function (err, results) {
  if (err) {
    console.error(err);
  } else {
    console.log('Saved: ', results);
  }
});

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err, results) {
  if (err) // ...
    console.log('meow');
  else {
    console.log('Saved: ', results);
  }
});

//mongoose.disconnect();
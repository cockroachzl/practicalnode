var mongoskin = require('mongoskin'),
    dbHost = '127.0.0.1',
    dbPort = 27017;

var db = mongoskin.db('mongodb://' + dbHost + ':' + dbPort + '/local', {safe: true});

db.bind('messages').bind({
    findOneAndAddText: function (text, fn) {
        db.collection('messages').findOne({}, function (error, item) {
            if (error) {
                console.error(error);
                process.exit(1);
            }
            console.info("findOne: ", item);
            item.text = text;
            var id = item._id.toString(); // we can store ID in a string
            console.info("before saving: ", item);
            db.collection('messages').save(item, function (error, count) {
                console.info("save: ", count);
                return fn(count, id);
            });
        })
    }
});

db.messages.findOneAndAddText('hi', function (count, id) {
    db.messages.find({
        _id: mongoskin.helper.toObjectID(id)
    }).toArray(function (error, items) {
        console.info("find: ", items);
        db.close();
        process.exit(0);
    });
});

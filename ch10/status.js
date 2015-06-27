/**
 * Created by zhangliang on 6/26/2015.
 */
var http = require('http');
var express = require('express');
var info = require('./info');

var app = express();

app.get('/status', function(req, res) {
   res.send({
        pid: process.pid,
        memory: process.memoryUsage(),
        uptime: process.uptime()
   });
});
app.get('/status/:info', info);

app.set('port', process.env.PORT || 3000);
var server = http.createServer(app);
var boot = function () {
    server.listen(app.get('port'), function(){
        console.info('Express server listening on port ' + app.get('port'));
    });
}
var shutdown = function() {
    server.close();
}
if (require.main === module) {
    boot();
} else {
    console.info('Running app as a module')
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}

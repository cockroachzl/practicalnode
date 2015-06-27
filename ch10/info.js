/**
 * Created by zhangliang on 6/26/2015.
 * a middleware
 */

var os = require('os'),
    exec = require('child_process').exec,
    async = require('async'),
    started_at = new Date();

module.exports = function (req, res, next) {
    var server = req.app;
    if (req.params.info) {
        var connections = {},
            swap;
        async.parallel([
                function (callback) {
                    //setTimeout(function () {
                    //    callback(null, 'one');
                    //}, 200);
                    exec('netstat -an | grep :80 | wc -l', function (error, res) {
                        connections['80'] = parseInt(res, 10);
                        callback(null, 'one');
                    })
                },
                function (callback) {
                    //setTimeout(function () {
                    //    callback(null, 'two');
                    //}, 100);
                    exec('netstat -an | grep :' + server.get('port') + ' | wc -l', function (error, res) {
                        connections[server.get('port')] = parseInt(res, 10);
                        callback(null, 'two');
                    });
                }],
            // optional callback
            function (err, results) {
                // the results array will equal ['one','two'] even though
                // the second function had a shorter timeout.
                res.send(JSON.stringify({
                    status: 'up',
                    version: server.get('version'),
                    started_at: started_at,
                    node: {
                        version: process.version,
                        memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'M',
                        uptime: process.uptime()
                    },
                    system: {
                        loadavg: os.loadavg(),
                        freeMemory: Math.round(os.freemem() / 1024 / 1024) + 'M',
                        env: process.env.NODE_ENV,
                        hostname: os.hostname(),
                        connections: connections,
                        swap: swap
                    }
                }, 0, 4));
            }
        )
    }
    else {
        res.send({status: 'up'});
    }
}

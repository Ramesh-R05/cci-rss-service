/**
 * Created by AMeghraj on 8/04/2015.
 */


var solr = require('solr-client');
var options = {
    "host": "solr-cluster01.digital.dev.local",
    "port": 80,
    "path": "/solr",
    "core": 'aww-search'
};
var client = solr.createClient(options);
var Q = require('q');

module.exports = {
    getSearchItems: function() {
        var deferred = Q.defer();
        client.search('q=*:*', function(err, obj){
            if (!err) {
                if (obj.response.numFound > 0) {
                    deferred.resolve(obj.response.docs);

                } else {
                    deferred.resolve(null);

                }
            } else {
                deferred.reject(err);
            }
        });

        return deferred.promise;
    }
};







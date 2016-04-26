import solrHelper from './solrHelper';
import mapper from './mappingHelper';
import builder from '../builders/rssBuilder';
import utils from '../utils';
import Q from 'q';

let buildFeed = props => {

    let deferred = Q.defer();

    solrHelper.loadData(props)
        .then(function (data) {
            props.solrData = onSolrDataReceived(data, props);

            try {
                let feed = builder.buildFeed(mapper.mapSolrData(props));
                deferred.resolve(feed.xml());
            }
            catch (err) {
                deferred.reject(err.message);
            }

        }, function (err) {
            deferred.reject(err);
        });

    return deferred.promise;
}

let onSolrDataReceived = (data, props) => {

    if (props.route.onDataReceived) {
        props.route.onDataReceived.forEach(function (func) {
            let handler = utils.compileFunction(func, {}, [data]);
            data = handler.execute();
        });
    }
    
    return data;
}

export default {
    buildFeed
};
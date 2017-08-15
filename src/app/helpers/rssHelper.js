import solrHelper from './solrHelper';
import mapper from './mappingHelper';
import builder from '../builders/rssBuilder';
import utils from '../utils';
import Q from 'q';

function onSolrDataReceived(sourceData, props) {
    let data = sourceData;
    if (props.route.onDataReceived) {
        props.route.onDataReceived.forEach(func => {
            let handler = utils.compileFunction(func, {}, [data]);
            data = handler.execute();
        });
    }

    return data;
}

function buildFeed(props) {
    let deferred = Q.defer();

    solrHelper.loadData(props)
        .then(data => {
            props.solrData = onSolrDataReceived(data, props);

            try {
                let feed = builder.buildFeed(mapper.mapSolrData(props));
                deferred.resolve(feed.xml());
            } catch (err) {
                deferred.reject(err.message);
            }
        }, err => {
            deferred.reject(err);
        });

    return deferred.promise;
}

export default {
    buildFeed
};

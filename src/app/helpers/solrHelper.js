import solr from 'solr-client';
import Q from 'q';
import merge from 'lodash/object/merge';

let compileQuery = (queryConfig, queryParams) => {
    let query = [];

    for(let i in queryConfig) {
        if (i !== 'queryParams') query.push(i + '=' + escape(queryConfig[i]));
    }

    if (queryConfig.queryParams) {
        for (let j in queryParams) {
            query.push(j + '=' + escape(queryParams[j]));
        }
    }
    return query.join('&');
}

let getDataSources = props => {

    let dataSources = [];
    for (let i in props.route.data) {
        let source = props.route.data[i];
        dataSources.push(querySolrData(source, props));
    }

    return dataSources;
}

let querySolrData = (dataSource, props) => {

    let deferred = Q.defer();

    let queryConfig = props.config.get('queries.' + dataSource.query);

    if (queryConfig) {
        let compiledQuery = compileQuery(queryConfig, props.queryParams);
        let client = solr.createClient(props.config.get('solr'));
        client.search(compiledQuery, function (err, obj) {
            if (!err) {
                deferred.resolve({
                    key: dataSource.key,
                    data: obj.response.docs,
                    mappings: dataSource.mappings ? dataSource.mappings : [dataSource.query]
                });
            } else {
                deferred.reject(err);
            }
        });
    } else {
        deferred.reject('Query configuration not found for key: ' + dataSource.query);
    }

    return deferred.promise;
}

export default {
    loadData: props => {
        return Q.all(getDataSources(props));
    },
    compileQuery
};







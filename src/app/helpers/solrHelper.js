import solr from 'solr-client';
import Q from 'q';

let compileQuery = (queryConfig, queryParams) => {
    let query = [];

    for (let i in queryConfig) {
        if (i !== 'queryParams') query.push(i + '=' + escape(queryConfig[i]));
    }

    if (queryConfig.queryParams) {
        for (let j in queryParams) {
            if (queryParams.hasOwnProperty(j)) {
                query.push(j + '=' + escape(queryParams[j]));
            }
        }
    }
    return query.join('&');
};

let querySolrData = (dataSource, props) => {
    let deferred = Q.defer();
    let queryConfig = props.config.get('queries.' + dataSource.query);
    const reqQuery = props.queryParams;
    const sourceFilter = reqQuery && reqQuery.source;
    const site = props.site;
    const siteConfig = props.config.sites[site.toLowerCase()];
    const filterEnable = siteConfig && siteConfig.withFilter;
    if (queryConfig) {
        if (sourceFilter && dataSource.key === 'items' && filterEnable) {
            queryConfig.q = sourceFilter.toLowerCase() === 'now to love' ?
                `-articleSource_t:*` :
                `articleSource_t:"${sourceFilter}"`;
        }
        let compiledQuery = compileQuery(queryConfig, props.queryParams);
        let client = solr.createClient(props.config.get('solr'));
        client.search(compiledQuery, (err, obj) => {
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
};

let getDataSources = props => {
    let dataSources = [];
    let routeData = props.route.data;
    for (let i in routeData) {
        if (routeData.hasOwnProperty(i)) {
            let source = routeData[i];
            dataSources.push(querySolrData(source, props));
        }
    }

    return dataSources;
};

export default {
    loadData: props => {
        return Q.all(getDataSources(props));
    },
    compileQuery
};

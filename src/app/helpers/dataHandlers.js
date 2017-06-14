import _ from 'underscore';

function findDataSource(dataSources, dataKey) {
    var dataSource = _.find(dataSources, d => {
        return d.key === dataKey;
    });

    if (dataSource && dataSource.data) {
        return dataSource;
    }

    return null;
}

function onSponsoredDataReceived(campaignFieldName, data) {
    var itemsDataSource = findDataSource(data, 'items');

    if (itemsDataSource && itemsDataSource.data) {
        let sanitised = [];

        itemsDataSource.data.forEach(item => {
            try {
                let campaignStr = item[campaignFieldName];
                if (campaignStr) {
                    let campaign = JSON.parse(campaignStr);
                    if (campaign[0].campaignType && campaign[0].sponsor) {
                        sanitised.push(item);
                    }
                }
            } catch (err) {
                //Intentionally empty
            }
        });

        itemsDataSource.data = sanitised;
    }

    return data;
}

function onSectionsDataReceived(pathFieldName, sectionNameFields, data) {
    var sectionsDataSource = findDataSource(data, 'sections');

    if (sectionsDataSource && sectionsDataSource.data) {
        let sectionHash = {};
        let itemsDataSource = findDataSource(data, 'items');

        if (itemsDataSource && itemsDataSource.data) {
            itemsDataSource.data.forEach(item => {
                let sections = [];
                let path = item[pathFieldName];

                if (path) {
                    path.forEach(pathId => {
                        if (sectionHash[pathId]) {
                            sections.push(sectionHash[pathId]);
                        } else {
                            let section = _.find(sectionsDataSource.data, d => d.id === pathId);
                            if (section) {
                                for (let i = 0; i < sectionNameFields.length; i++) {
                                    let sectionName = section[sectionNameFields[i]];
                                    if (sectionName) {
                                        sectionHash[pathId] = sectionName;
                                        sections.push(sectionName);
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }
                /*eslint-disable */
                item.__sections = sections;
                /*eslint-enable */
            });
        }
    }

    return data;
}

function onSourceFilter(props, dataSource) {
    let queryConfig = props.config.get('queries.' + dataSource.query);
    const sourceFilter = props.queryParams && props.queryParams.source;
    const site = props.site.toLowerCase();
    const enableFilterWithSourceName = props.config.sites[site] && props.config.sites[site].enableFilterWithSourceName;

    if (queryConfig && sourceFilter && dataSource.key === 'items' && enableFilterWithSourceName) {
        queryConfig.q = sourceFilter.toLowerCase() === enableFilterWithSourceName ?
            `-articleSource_t:* OR -source_t:*` :
            `articleSource_t:"${sourceFilter}" OR source_t:"${sourceFilter}"`;
    }
}

export default {
    onSponsoredDataReceived,
    onSectionsDataReceived,
    onSourceFilter
};

import _ from 'underscore';

let findDataSource = (dataSources, dataKey) => {
    var dataSource = _.find(dataSources, d => {
        return d.key === dataKey;
    });

    if (dataSource && dataSource.data) {
        return dataSource;
    }

    return null;
};

let onSponsoredDataReceived = (campaignFieldName, data) => {
    var itemsDataSource = findDataSource(data, 'items');

    if (itemsDataSource && itemsDataSource.data) {
        let sanitised = [];

        itemsDataSource.data.forEach(function (item) {
            try {
                var campaignStr = item[campaignFieldName];
                if (campaignStr) {
                    let campaign = JSON.parse(campaignStr);
                    if (campaign[0].campaignType && campaign[0].sponsor) {
                        sanitised.push(item);
                    }
                }
            }
            catch (err) { }
        });

        itemsDataSource.data = sanitised;
    }

    return data;
};

let onSectionsDataReceived = (pathFieldName, sectionNameFields, data) => {
    var sectionsDataSource = findDataSource(data, 'sections');

    if (sectionsDataSource && sectionsDataSource.data) {
        var sectionHash = {};
        var itemsDataSource = findDataSource(data, 'items');

        if (itemsDataSource && itemsDataSource.data) {
            itemsDataSource.data.forEach(function (item) {
                var sections = [];
                var path = item[pathFieldName];

                if (path) {
                    path.forEach(function (pathId) {

                        if (sectionHash[pathId]) {
                            sections.push(sectionHash[pathId]);
                        }
                        else {
                            var section = _.find(sectionsDataSource.data, function (d) {
                                return d.id === pathId;
                            });
                            if (section) {
                                for (var i = 0; i < sectionNameFields.length; i++) {
                                    var sectionName = section[sectionNameFields[i]];
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
                item['__sections'] = sections;
            });
        }
    }

    return data;
};

export default {
    onSponsoredDataReceived,
    onSectionsDataReceived
};

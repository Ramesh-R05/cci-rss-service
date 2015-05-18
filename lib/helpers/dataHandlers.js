'use strict';

var _ = require('underscore');

var onSponsoredDataReceived = function (campaignFieldName, data) {

    var itemsDataSource = _.find(data, function (d) {
        return d.key === 'items';
    });

    if (itemsDataSource && itemsDataSource.data) {

        var sanitised = [];

        itemsDataSource.data.forEach(function (item) {
            try {
                var campaignStr = item[campaignFieldName];
                if (campaignStr) {
                    var campaign = JSON.parse(campaignStr);
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
}

module.exports = {
    onSponsoredDataReceived: onSponsoredDataReceived
}
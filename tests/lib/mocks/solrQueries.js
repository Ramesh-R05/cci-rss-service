var nock = require('nock');
var util = require('util');

var solrChannelResult = {
    response: {
        docs: [
            {
                pageTitle_t: 'Donec magna purus',
                siteUrl_t: 'http://www.aww.com.au',
                pageMetaDescription_t: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            }
        ]
    }
};

var solrItemsResult = {
    response: {
        docs: [
            {
                pageTitle_t: '',
                contentTitle_t: '',
                nodeName_t: 'Donec blandit eget ex feugiat',
                pageMetaDescription_t: 'Morbi tortor eros, blandit id libero eu, accumsan facilisis leo.',
                siteUrl_t: 'http://www.example.com',
                url_t: '/test/some-page',
                contentImageUrl_t: 'http://www.example.com/images/test.jpg',
                contentCampaign_t: '[{ "campaignType": "Native", "sponsor": "Kellogs" }]'
            }
        ]
    }
};

var emptySolrResponse = {
    response: {
        docs: []
    }
};

var mock = function (site, solrHost) {

    var host = 'http://' + (solrHost ? solrHost : 'solr01.digital.dev.local');

    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%22Homepage%22&rows=1&wt=json', site))
    .reply(200, JSON.stringify(solrChannelResult));

    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28BauerArticle%20OR%20Article%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28FoodArticle%20OR%20FoodStudioArticle%20OR%20Article%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    nock(host)
    .get(util.format('/solr/%s-search/select?q=contentCampaign_t%3A*&fq=nodeTypeAlias_t%3A%28BauerArticle%20OR%20Article%29&sort=pageDateCreated_dt%20desc&rows=500&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));


    nock(host)
    .get('/solr/invalid-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%22Homepage%22&rows=1&wt=json')
    .reply(404, '');

    nock(host)
    .get('/solr/invalid-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28BauerArticle%20OR%20Article%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json')
    .reply(404, '');
}

module.exports = {
    mock: mock
}
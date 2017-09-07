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
                contentCampaign_t: '[{ "campaignType": "Native", "sponsor": "Kellogs" }]',
                contentBody_t: '[{ "type": "paragraph",  "label": "Paragraph", "content": "Aenean mauris elit, congue quis leo sit amet." }]',
                contentTags_ss: [
	                "food:Cuisine:Italian",
	                "food:Number of ingredients:6 or more ingredients",
                ],
                recipeIngredients_t: '[{"heading":"Balsamic honey pulled-pork buns","ingredients":[{"quantity":"800","measure":"gram","food":"trimmed pork shoulder"},{"quantity":"2","measure":"tablespoon","food":"olive oil"},{"quantity":"1","measure":"","food":"brown onion, chopped"},{"quantity":"4","measure":"clove","food":"garlic, peeled"},{"quantity":"4","measure":"","food":"sprigs fresh thyme"},{"quantity":"2","measure":"","food":"sprigs fresh rosemary"},{"quantity":"2","measure":"cup","food":"(500ml) chicken stock"},{"quantity":"1","measure":"cup","food":"(250ml) water"},{"quantity":"4","measure":"","food":"brioche buns, sliced"}]}]'
            }
        ]
    }
};

var solrSectionsResult = {
    response: {
        docs: []
    }
};

var emptySolrResponse = {
    response: {
        docs: []
    }
};

var mock = function (site, solrHost) {

    var host = 'http://' + (solrHost ? solrHost : 'solr-dev.bauer-media.internal');

    //queries.channel.default
    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%22Homepage%22&rows=1&wt=json', site))
    .reply(200, JSON.stringify(solrChannelResult));

    //queries.sections.default
    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28Section%20OR%20RecipeSection%20OR%20Subsection%20OR%20RecipeSubsection%29&rows=500&wt=json', site))
    .reply(200, JSON.stringify(solrSectionsResult));

    //queries.item.default
    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28BauerArticle%20OR%20Article%20OR%20BauerGallery%20OR%20Gallery%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //queries.item.fullcontent
    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28BauerArticle%20OR%20Article%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //queries.item.recipes
    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28Recipe%29&sort=pageDateCreated_dt%20desc&rows=500&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //queries.item.sponsored
    nock(host)
    .get(util.format('/solr/%s-search/select?q=contentCampaign_t%3A*&fq=nodeTypeAlias_t%3A%28BauerArticle%20OR%20Article%20OR%20BauerGallery%20OR%20Gallery%29&sort=pageDateCreated_dt%20desc&rows=500&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //food.queries.item.default
    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28FoodArticle%20OR%20FoodStudioArticle%20OR%20Article%20OR%20Gallery%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //food.queries.item.fullcontent
    nock(host)
    .get(util.format('/solr/%s-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28FoodArticle%20OR%20FoodStudioArticle%20OR%20Article%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //food.queries.item.sponsored
    nock(host)
    .get(util.format('/solr/%s-search/select?q=contentCampaign_t%3A*&fq=nodeTypeAlias_t%3A%28FoodArticle%20OR%20FoodStudioArticle%20OR%20Article%20OR%20Gallery%29&sort=pageDateCreated_dt%20desc&rows=500&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //now.queries.item.with.filter
    nock(host)
    .get(util.format('/solr/%s-search/select?q=articleSource_t%3A%22NW%22%20OR%20source_t%3A%22NW%22&fq=nodeTypeAlias_t%3A%28HomesArticle%20OR%20BauerArticle%20OR%20Article%20OR%20BauerGallery%20OR%20Gallery%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json', site))
    .reply(200, JSON.stringify(solrItemsResult));

    //invalid site: queries.channel.default
    nock(host)
    .get('/solr/invalid-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%22Homepage%22&rows=1&wt=json')
    .reply(404, '');

    //invalid site: queries.sections.default
    nock(host)
    .get('/solr/invalid-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28Section%20OR%20RecipeSection%20OR%20Subsection%20OR%20RecipeSubsection%29&rows=500&wt=json')
    .reply(404, '');

    //invalid site: queries.item.default
    nock(host)
    .get('/solr/invalid-search/select?q=*%3A*&fq=nodeTypeAlias_t%3A%28BauerArticle%20OR%20Article%20OR%20BauerGallery%20OR%20Gallery%29&sort=pageDateCreated_dt%20desc&rows=50&wt=json')
    .reply(404, '');
}

module.exports = {
    mock: mock
}
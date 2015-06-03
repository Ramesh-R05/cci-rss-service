#RSS Service

##Introduction

The RSS Service generates RSS feeds for our Solr based websites.

The following feeds are currently supported:

###Shortend Teaser

```
/rss/{site}
```

A simple feed of the most recent content.  Returns the content title, url, description and image only.

###Full Content

```
/rss/{site}/full-content
```

The most recent articles with full content body included for each feed item.

###Sponsored Content

```
/rss/{site}/sponsored
```

Returns content that has a campaign assigned to it. Includes all content details from the shortened teaser feed with additional campaign specific data.

###Recipes

```
/rss/{site}/recipes
```

A simple feed of the most recent recipes. Returns the content title, url, description, image and recipe tags only.

###Recipes - Full Content

```
/rss/{site}/recipes/full-content
```

The most recent recipes with full content details included for each feed item.

**Note:** In the RSS feed paths above ```{site}``` should be replaced with the website's Solr core prefix (e.g. aww, food, wd).

##Running the app

Install the necessary dependencies:

```bash
npm install
```

Start the service:

```bash
npm start
```

By default the service will run on port 8001.  If this port is not available you may receive an EACCES error.

```bash
Error: listen EACCES
    at ...
```

Should this occur, the port number can be passed as an environment variable.

```bash
set PORT=8002 && npm start
```


##Running tests

Install the necessary dependencies:

```bash
npm install
```

Run the unit and integration tests:

```bash
npm test
```

This will also generate a code coverage report in the /coverage directory.


##Configuring RSS Feeds

There are five main configuration files used by the RSS service.

###Solr.json

Contains basic Solr settings for the service.

```json
{
  "host": "solr01.digital.dev.local",
  "port": 80,
  "path": "/solr",
  "core": "{{site}}-search"
}
```
Note that in the core configuration ```{{site}}``` will be replaced by the site code value for the feed. For example:

When viewing the feed at: /rss/**aww**/sponsored.

The value of core will be set to: **aww-search**.

###Queries.json

Defines the different Solr queries used by the service.

```json
{
  "channel": {

    "default": {
      "q": "*:*",
      "fq": "nodeTypeAlias_t:\"Homepage\"",
      "rows": "1"
    }

  },

  "item": {

    "default": {
      "q": "*:*",
      "fq": "nodeTypeAlias_t:(BauerArticle OR Article OR BauerGallery OR Gallery)",
      "sort": "pageDateCreated_dt desc",
      "rows": "50"
    }

  }
}
```
In the code above the default feed items query can be accessed by key ```item.default``` and will generate the following query:

```solr
/select?q=*:*&fq=nodeTypeAlias_t:(BauerArticle OR Article OR BauerGallery OR Gallery)&sort=pageDateCreated_dt desc&rows=50
```


###Mappings.json

...

###Routes.json

Used for RSS feed route configuration.  There will be one entry for each unique feed in the service. 

Each entry contains the following settings:

1. ```path```: The route path for the feed.  Paths are relative to ```/rss/{site}/```, meaning that a feed in the routes configuration is available for all sites.
2. ```data```: An array of data set configuration items for the RSS feed.  

  Each item contains the following settings:

  1. ```key```: An identifier for the data set.
  2. ```query```: The Solr query to execute for the data set.  This must correspond to a query configuration key in ```queries.json``` e.g. ```item.default```.
  3. ```mappings```: (optional) An array of mappings to apply to each result from the Solr query.  Each item in this array must correspond to a mapping configuration key in ```mappings.json``` e.g. ```item.default```.  If this setting is omitted the service will try and find a mapping configuration using the value of ```query```.

  **Note**: A feed must contain a ```channel``` and ```items``` data set configuration.

3. ```onDataReceived```: (optional) An array of data handler functions to execute after all feed data has be received.  This allows for any sanitation or modification of the data before the mapping process occurs.  Data handler functions should be exposed via ```/lib/helpers/dataHandlers.js```.  The feed data will be passed as a parameter to your data handler function after any custom parameters defined in your handler function configuration.

```json
{
  "default": {
    "path": "/",
    "data": [
      {
        "key": "channel",
        "query": "channel.default"
      },
      {
        "key": "items",
        "query": "item.default",
        "mappings": [ "item.default", "item.sections" ]
      },
      {
        "key": "sections",
        "query": "sections.default"
      }
    ],
    "onDataReceived": [
      {
        "fn": "onSectionsDataReceived",
        "params": [ "path_ss", [ "contentTitle_t", "nodeName_t" ] ]
      }
    ]
  },
  
 }
```

The example above is the route configuration for the RSS feed at path ```/rss/{site}/```.  It will perform Solr queries to retrieve, ```channel```, ```items``` and ```sections``` data. When all data is recieved it will run the ```onSectionsDataReceived``` handler function to add section information to each result from the ```items``` query.

###Sites.json

Used to provide any site specific overrides or extensions for any of the service configuration settings.

```json
{
  "food": {
    "queries": {
      "item": {
        "default": {
          "fq": "nodeTypeAlias_t:(FoodArticle OR FoodStudioArticle OR Article OR Gallery)"
        }
      }
    }
  }
}
```

The example above overrides the ```queries.item.default.fq``` configuration value for Food RSS feeds to filter the Solr query results on a different set of content types.

It is also possible to provide site environment specific overrides by adding entries into the sites configuration file with the following key format: ```{site}_{environment}```.

The example below will override the ```solr.host``` configuration value for Food RSS feeds in the ```live``` environment.

```json
{
  "food_live": {
    "solr": {
      "host": "solr.food.wn.live.local"
    }
  }
}
```

###Environment overrides

Environment specific configuration files can be used to override any of the service configuration settings.  

These files are named using the format: ```{environment}.json```, where ```{environment}``` is the value of the ```$NODE_ENV``` environment variable.

Environment overrides get applied before any site specific environment configuration overrides.

**Sample live configuration (live.json):**
```json
{
  "solr": {
    "host": "solr01.digital.live.local"
  }
}
```
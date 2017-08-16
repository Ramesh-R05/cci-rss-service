# RSS Service

## Introduction

The RSS Service generates RSS feeds for our Solr based websites.

The following feeds are currently supported:

### Shortend Teaser

```
/rss/{site}
```

A simple feed of the most recent content.  Returns the content title, url, description and image only.

### Full Content

```
/rss/{site}/full-content
```

The most recent articles with full content body included for each feed item.

### Sponsored Content

```
/rss/{site}/sponsored
```

Returns content that has a campaign assigned to it. Includes all content details from the shortened teaser feed with additional campaign specific data.

### Recipes

```
/rss/{site}/recipes
```

A simple feed of the most recent recipes. Returns the content title, url, description, image and recipe tags only.

### Recipes - Full Content

```
/rss/{site}/recipes/full-content
```

The most recent recipes with full content details included for each feed item.

**Note:** In the RSS feed paths above ```{site}``` should be replaced with the website's Solr core prefix (e.g. aww, food, wd).

## Running the app

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


## Running tests

Install the necessary dependencies:

```bash
npm install
```

Run the unit and integration tests:

```bash
npm test
```

This will also generate a code coverage report in the /coverage directory.


## Configuring RSS Feeds

There are five main configuration files used by the RSS service.

### Solr.json

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

### Queries.json

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


### Mappings.json

Contains all mapping configurations for the RSS feeds.  These are used to map Solr field values (or other values) to the specific properties required to generate an RSS reed.

Consider the mapping configurations below:

```json
{
  "channel": {

    "default": {
      "title": {
        "map": [ "pageTitle_t", "contentTitle_t" ]
      },
      "feed_url": {
        "map": {
          "fn": "mapFeedUrl",
          "params": [ "@__request" ]
        }
      },
      "site_url": {
        "map": "siteUrl_t"
      },
      "description": {
        "map": [ "pageMetaDescription_t", "contentSummary_t" ],
        "afterMap": [
          {
            "fn": "sanitise"
          }
        ]
      },
      "copyright": {
        "map": {
          "fn": "mapCopyright"
        }
      },
      "ttl": {
        "value": 60
      }
    },

    "sponsored": {
      "custom_namespaces": {
        "mapObject": {
          "mvcf": {
            "value": "http://feed.aww.com.au/ns/mvcf/"
          }
        }
      }

    }
  },

 }
```

This is an example of the mapping configurations that can be used to set the required properties for the channel element of the RSS feed.  There are two mapping groups defined above: ```channel.default``` and ```channel.sponsored```.

```channel.default``` sets the following properties:

1. ```title```
2. ```feed_url```
3. ```site_url```
4. ```description```
5. ```copyright```
6. ```ttl```

```channel.sponsored``` sets only one property: ```custom_namespaces```.

Exactly which mapping groups get applied to the results of a Solr query is determined in ```routes.json```.

For each property to be mapped a configuration object must be specified.  Valid configuration settings are as follows:

1. ```map```: (mapping directive) Will map to a single value. This is the most common type of mapping directive.  The value of this property can be one of the following:

	- A single Solr field name.

		```
		"map": "siteUrl_t"
		```

	- An array of Solr field names.

		```
		"map": [ "pageTitle_t", "contentTitle_t" ]
		```

	The actual value mapped will be the first non-empty Solr field value from the array.  You can use this approach to provide fallback mapping properties if there is a chance that the preferred one may be empty.

	- A mapping function configuration object.

		```
		"map": {
			"fn": "mapFeedUrl",
			"params": [ "@__request" ]
		}
		```

2. ```mapArray```: (mapping directive) Will map to an array of values.  This must be an array containing any of the valid values for the ```map``` property.

	Example:

	```
	"mapArray": [
		"siteUrl_t",
		[ "pageTitle_t", "contentTitle_t" ],
		{
			"fn": "mapCopyright"
		}
	]
	```


3. ```mapObject```: (mapping directive) Will map to an object.  For each property in the object a valid mapping configuration object must be specified.

	Example:

	```
	"mapObject": {
		"url": {
			"map": "contentImageUrl_t"
		},
		"type": {
            "map": {
              "fn": "mapMimeType",
              "params": [ "@contentImageUrl_t" ]
            }
		}
	}
	```

	Assuming that the value of "contentImageUrl_t" is "http://www.example.com/some-image.jpg" the value returned by the configuration above would be:

	```
	{
		"url": "http://www.example.com/some-image.jpg",
		"type": "image/jpeg"
	}
	```

	Note: The "mapMimeType" mapping function takes an asset url as a parameter and returns the mime type.


4. ```mapObjectArray```: (mapping directive) Will map to an array of objects.  For each property in the object a valid mapping configuration object must be specified.

	Example:

	```
	"exampleProperty": {
		"mapObjectArray": {
			"objProp1": {
				"map": "solrField1"
			},
			"objProp2": {
				"map": "solrField2"
			}
		}
	}
	```

	Given the mapping configuration above and assuming that the values for "solrField1" and "solrField2" are "1234" and "abcd" respectively, the value mapped to property "exampleProperty" will be:

	```
	[
		{ "objProp1": "1234" },
		{ "objProp2": "abcd" }
	]
	```

5. ```afterMap```:  An array of functions to execute against the result of a mapped value.

	Example:

	```
	"url": {
		"map": "contentImageUrl_t",
		"afterMap": [
			{
				"fn": "format",
				"params": [ "%s?width=800" ]
			}
		]
	}
	```

	Note: The actual mapped value will be passed as the last parameter of the after map function.


6. ```value```: Used to set the value of a property explicitly.

	For example:

	```
	"ttl": {
		"value": 60
	}
	```

	If ```value``` is set any mapping directive for a property will be ignored.  So in the following example if the value of "contentImageUrl_t" is "http://www.example.com/some-image.jpg", the actual value set for property ```url``` will be "http://www.example.com/another-image.jpg".

	```
	"url": {
		"map": "contentImageUrl_t",
		"value": "http://www.example.com/another-image.jpg"
	}
	```

Note: Only one mapping directive setting may be specified in a mapping configuration object.

#### Adding a new data item

1. Add the required item to the mappings.json config as specified above.

eg. For a date field:

```
"updatedDate": {
  "map": [ "nodeDateIndexed_dt" ]
}
```

OR for a text field:

```
"author": {
  "map": [ "articleSource_t" ],
  "afterMap": [
    {
      "fn": "sanitise"
    }
  ]
}
```

2. Add the new property to the RSS function and generateXML function in the rss-builder repo located here:

https://github.com/bauerxcelmedia/rss-builder/blob/master/lib/index.js

#### Mapping functions

Any mapping functions you wish to use must be exposed via ```/lib/helpers/mappingFunctions.js```.

When configuring mapping function parameters be aware that a string beginning with "@" signifies a property value not a character string.  The value of that parameter will be resolved from the mapping data prior to the execution of the mapping function.


### Routes.json

Used for RSS feed route configuration.  There will be one entry for each unique feed in the service.

Each entry contains the following settings:

1. ```path```: The route path for the feed.  Paths are relative to ```/rss/{site}/```, meaning that a feed in the routes configuration is available for all sites.
2. ```data```: An array of data set configuration items for the RSS feed.
3. ```onDataReceived```: (optional) An array of data handler functions to execute after all feed data has be received.  This allows for any sanitation or modification of the data before the mapping process occurs.  Data handler functions should be exposed via ```/lib/helpers/dataHandlers.js```.  The feed data will be passed as a parameter to your data handler function after any custom parameters defined in your handler function configuration.

Data set configuration items contain the following settings:

1. ```key```: An identifier for the data set.
2. ```query```: The Solr query to execute for the data set.  This must correspond to a query configuration key in ```queries.json``` e.g. ```item.default```.
3. ```mappings```: (optional) An array of mappings to apply to each result from the Solr query.  Each item in this array must correspond to a mapping configuration key in ```mappings.json``` e.g. ```item.default```.  If this setting is omitted the service will try and find a mapping configuration using the value of ```query```.

**Note**: A feed must contain a ```channel``` and ```items``` data set configuration.

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

### Sites.json

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

### Environment overrides

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

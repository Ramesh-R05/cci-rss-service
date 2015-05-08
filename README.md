#RSS Service

##Introduction

The RSS Service generates RSS feeds for our Solr based websites.

The following feeds are currently supported:

###Shortend Teaser

**/rss/{site}**

A simple feed of the most recent articles.  Returns the content title, url, description and image only.

###Sponsored Articles

**/rss/{site}/sponsored**

Returns articles that have a campaign assigned to it. Includes all content details from the shortened teaser feed with additional campaign specific data.

**Note:** In the RSS feed paths above **{site}** should be replaced with the website's Solr core prefix (e.g. aww, food, wd).

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
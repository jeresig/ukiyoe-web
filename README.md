Ukiyo-e.org Web Site
====================

This is the new version of the Ukiyo-e.org web site. Uses a Mongodb+Elasticsearch backend. See [ukiyoe-models](https://github.com/jeresig/ukiyoe-models) for more information about the models that are used in running the site.

## ENV Variables

**Required:**

* `MONGODB_URL`: The location of the MongoDB server and database where the site's data is stored.

    Format: `mongodb://USERNAME:PASSWORD@SERVER:PORT/DATABASE`

* `ELASTICSEARCH_URL`: The location of the Elasticsearch server, where the site data is indexed.

    Format: `http://SERVER:PORT`

**Optional:**

* `NODE_ENV`: `production`
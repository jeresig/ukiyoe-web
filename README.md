Ukiyo-e.org Web Site
====================

This is the new version of the Ukiyo-e.org web site. Uses a Mongodb+Elasticsearch backend. See [ukiyoe-models](https://github.com/jeresig/ukiyoe-models) for more information about the models that are used in running the site.

## ENV Variables

**Required:**

* `MONGO_URL`: `mongodb://USERNAME:PASSWORD@SERVER:PORT/DATABASE`

**Optional:**

* `NODE_ENV`: `production`
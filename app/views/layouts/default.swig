<!DOCTYPE html>
<html lang="{{ __("en-US") }}" class="{{ __("en-US") }}">
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <meta http-equiv="content-language" content="{{ __("en-US") }}"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="{{ CDN("/images/favicon.png", {"raw": true}) }}" type="image/x-icon"/>
    <title>{{ title }} - {{ __("Ukiyo-e Search") }}</title>
    {% if desc %}<meta name="description" content="{{ desc }}"/>{% endif %}

    {% if image %}
    <meta name="twitter:card" content="photo">
    <meta name="twitter:url" content="{{ URL(image) }}">
    <meta name="twitter:title" content="{{ getTitle(image) }}">
    <meta name="twitter:image" content="{{ image.getScaledURL() }}">
    <meta property="og:title" content="{{ getTitle(image) }}"/>
    <meta property="og:type" content="article"/>
    <meta property="og:url" content="{{ URL(image) }}"/>
    <meta property="og:image" content="{{ image.getScaledURL() }}"/>
    <meta property="og:site_name" content="{{ __("Ukiyo-e Search") }}"/>
    {% endif %}

    {{ CDN("/css/bootstrap.min.css") }}
    {{ CDN("/css/bootstrap-theme.min.css") }}
    {{ CDN("/css/select2.css") }}
    {{ CDN("/css/jquery.nouislider.css") }}
    {{ CDN("/css/style.css") }}

    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    <div class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#header-navbar">
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">
                    {{ __("Ukiyo-e Search") }}</a>
            </div>

            <div id="header-navbar" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <!--<li{% if getSiteCategory() === "search" %} class="active"{% endif %}><a href="/search">{{ __("Search") }}</a></li>-->
                    <li{% if getSiteCategory() === "sources" %} class="active"{% endif %}>
                        <a href="{{ URL("/sources") }}">
                            {{ __("Sources") }}</a></li>
                    <li><a href="http://blog.ukiyo-e.org/">
                        {{ __("Blog") }}</a></li>
                    <li{% if getSiteCategory() === "about" %} class="active"{% endif %}>
                        <a href="{{ URL("/about") }}">
                        {{ __("About") }}</a></li>
                    <li class="nav-divider"></li>
                    <li><a href="{{ getOtherURL() }}">
                        {% if curLocale() == "en" %}
                        <img src="{{ CDN("/images/ja.png", {"raw": true}) }}"
                            alt="{{ __("Switch Language") }}" />
                        {% else %}
                        <img src="{{ CDN("/images/en.png", {"raw": true}) }}"
                            alt="{{ __("Switch Language") }}" />
                        {% endif %}
                        {{ __("Switch Language") }}</a></li>
                </ul>

                <form action="/search" method="GET"
                    class="navbar-form navbar-right search">
                    <input type="text" class="form-control search-query"
                        placeholder="{{ __("Search") }}" id="q"
                        name="q" value="{{ q }}" />
                    <input type="submit" class="btn btn-primary"
                        value="{{ __("Search") }}" />
                </form>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="lang-notice alert alert-error" style="display:none;">
            {{ __("Language Notice") }}
            <a href="{{ getOtherURL }}">{{ __("Language Redirect") }}</a>
        </div>

        {% block content %}{% endblock %}
    </div>

    {{ CDN("/js/jquery.min.js") }}
    {{ CDN("/js/bootstrap.min.js") }}
    {{ CDN("/js/select2.js") }}
    {{ CDN("/js/jquery.nouislider.js") }}
    {{ CDN("/js/app.js") }}
    {% block script %}{% endblock %}
</body>
</html>

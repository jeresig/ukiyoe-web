<!DOCTYPE html>
<html lang="{{ __("en-US") }}" class="{{ __("en-US") }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="{{ __("en-US") }}"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
{% if req.image %}
    <!-- https://dev.twitter.com/docs/cards/types/photo-card -->
    <meta name="twitter:card" content="photo">
    <meta name="twitter:site" content="@ukiyo-e.org">
    <meta name="twitter:creator" content="@jeresig">
    <meta name="twitter:title" content="{{ title }}">
    <meta name="twitter:image" content="{{ image_url }}">
    <meta name="twitter:image:width" content="{{ image_width }}">
    <meta name="twitter:image:height" content="{{ image_height }}">
{% endif %}
    <link rel="icon" href="{{ CDN("/images/favicon.png", {"raw": true}) }}" type="image/x-icon"/>
    <title>{{ title }}</title>
    {% if page_desc %}<meta name="description" content="{{ page_desc }}"/>{% endif %}

    {{ CDN("/bower/bootstrap/dist/css/bootstrap.min.css") }}
    {{ CDN("/bower/bootstrap/dist/css/bootstrap-theme.min.css") }}
    {{ CDN("/bower/select2/select2.css") }}
    {{ CDN("/bower/nouislider/jquery.nouislider.css") }}
    {{ CDN("/css/app.css") }}

    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    <div class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="/">
                    {{ __(title) }}</a>
            </div>

            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li><a href="/">{{ __("Search") }}</a></li>
                </ul>
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

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    {{ CDN("/bower/select2/select2.js") }}
    {{ CDN("/bower/nouislider/jquery.nouislider.js") }}
    {{ CDN("/js/app.js") }}
    {% block script %}{% endblock %}
</body>
</html>

{% extends "../layouts/default.swig" %}

{% block title %}{{ __("Index Page") }}{% endblock %}

{% block content %}

{% for artist in extractedartists %}
    <p>{{ artist.name.name }}</p>
{% endfor %}

{% endblock %}
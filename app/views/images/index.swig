{% extends "../layouts/default.swig" %}

{% block title %}{{ __("Index Page") }}{% endblock %}

{% block content %}


{% for image in images %}
<p><img src="http://data.ukiyo-e.org/{{ image.source }}/thumbs/{{ image.imageName }}.jpg"/></p>
<p>{{ image.title }} by {% if image.artistNames[0] %}{{ image.artistNames[0].name }}{% endif %}</p>
{% endfor %}

{% endblock %}
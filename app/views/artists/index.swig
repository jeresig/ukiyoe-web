{% extends "../layouts/default.swig" %}

{% block title %}{{ __("Index Page") }}{% endblock %}

{% block content %}

{% for artist in artists %}
    <p>{{ artist.name.name }}</p>
	<ul>
		{% for bio in artist.bios %}
			<li>{{ bio.name.name }} ({{ bio.source }})</li>
		{% endfor %}
	</ul>
{% endfor %}

{% endblock %}
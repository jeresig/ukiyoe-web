{% extends "../layouts/default.swig" %}

{% block title %}{{ __("Index Page") }}{% endblock %}

{% block content %}
<div class="row">
    <h1 class="col-md-12">{{ title }}</h1>
    {% if url %}
        <p class="col-md-12"><a href="{{ url }}">{{ url }}</a></p>
    {% endif %}
</div>

<div id="results">
    <div class="state row col-md-12">
        <span class="total">{{ __("<strong>%s</strong> prints found.", total)|raw }}</span>
        <span class="page">{{ __("Viewing prints %s to %s.", start, end) }}</span>
    </div>

<!--
<p><input type="hidden" id="selectArtist" style="width:500px;"/></p>

<form action="/images/search" method="GET">
<p>Query: <input type="search" name="q" value="{{q}}"/></p>
<p>
    <input type="text" size="2" name="startDate" value="{{startDate}}"/>
    <div class="slider"></div>
    <input type="text" size="2" name="endDate" value="{{endDate}}"/>
</p>
<p><input type="submit" value="Search"/></p>
</form>
-->

{% for image in images %}
<div style="float:left;width:220px;height:240px;">
<a href="{{ URL(image) }}"><img src="{{ image.getThumbURL() }}"/></a>
<span>{% for artist in image.artists %}
    {% if artist.artist %}
        <a href="{{ URL(artist.artist) }}">{{ artist.artist.name.name }}</a>
    {% else %}
        {{ artist.name.name }}
    {% endif %}
{% endfor %}</span>
{% if image.dateCreated %}
<span>{{ getDate(image) }}</span>
{% endif %}
</div>
<!--<p>{{ image.title }} by {% if image.artistNames[0] %}{{ image.artistNames[0].name }}{% endif %}</p>-->
{% endfor %}

<div class="search-nav row col-md-12">
    {% if prev %}
        <span class="prev"><a href="{{ prev }}" class="btn btn-primary"
            rel="prev">&laquo; {{ __("Previous") }}</a></span>
    {% endif %}

    {% if next %}
        <span class="next"><a href="{{ next }}" class="btn btn-primary"
            rel="next">{{ __("Next") }} &raquo;</a></span>
    {% endif %}
</div>

</div>

{% endblock %}
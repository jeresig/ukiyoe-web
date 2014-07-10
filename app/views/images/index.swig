{% extends "../layouts/default.swig" %}

{% block title %}{{ __("Index Page") }}{% endblock %}

{% block content %}
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

{% endblock %}
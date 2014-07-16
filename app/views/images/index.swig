{% extends "../layouts/default.swig" %}

{% block title %}{{ __("Index Page") }}{% endblock %}

{% block content %}

{% if artist %}
<div class="row">
    <h1 class="col-xs-12 artist_name">
        {{ artist.name.name }}

        {% if artist.name.given_kanji %}
        <span class="artist_name_kanji">
        {% if artist.name.surname_kanji %}
            (<ruby>
            {{ artist.name.surname_kanji }}
            <rp>(</rp><rt>{{ artist.name.surname_kana }}</rt><rp>)</rp>
            </ruby>
        {% else %}
        ({% endif %}<ruby>
        {{ artist.name.given_kanji }}
        <rp>(</rp><rt>{{ artist.name.given_kana }}</rt><rp>)</rp>
        </ruby>{% if artist.name.generation %}
            &nbsp;{{ artist.name.generation }}世{% endif %})
        {% else %}
        {% if artist.name.kanji %}
        (<ruby class="artist_kanji">
            {{ artist.name.kanji }}
            <rp>(</rp><rt>{{ artist.name.kana }}</rt><rp>)</rp>
        </ruby>)
        {% endif %}
        </span>
        {% endif %}
    </h1>
</div>

{% if start == 1 %}
{% if artist.life.start %}
<div class="row">
    <div class="col-xs-12">
    {% if artist.life.start %}
        <strong>{{ __("Born:") }}</strong>
        {% if artist.life.start_ca %}{{ __("ca. ") }}{% endif %}
        {{artist.life.start}}
    {% endif %}
    &dash;
    {% if artist.life.end %}
        <strong>{{ __("Died:") }}</strong>
        {% if artist.life.end_ca %}{{ __("ca. ") }}{% endif %}
        {{artist.life.end}}
    {% endif %}
    {% if artist.life.current %}
        {{ __("Alive") }}
    {% endif %}
    </div>
</div>
{% endif %}
{% if artist.active.start %}
<div class="row">
    <div class="col-xs-12">
        <strong>{{ __("Active:") }}</strong>
        {% if artist.active.start %}
            {% if artist.active.start_ca %}{{ __("ca. ") }}{% endif %}
            {{artist.active.start}}
        {% endif %}
        &dash;
        {% if artist.active.end %}
            {% if artist.active.end_ca %}{{ __("ca. ") }}{% endif %}
            {{artist.active.end}}
        {% endif %}
        {% if artist.active.current %}
            {{ __("Alive") }}
        {% endif %}
    </div>
</div>
{% endif %}

{% if bio %}
<div class="row">
    <div class="col-xs-12">
        <blockquote class="bio">{{ bio }}</blockquote>
    </div>
</div>
{% endif %}

<div class="row">
    <div class="col-xs-12">
        <strong>{{ __("Bios:") }}</strong>
        {% for bio in artist.bios %}
            <a href="{{ bio.url }}">{{ fullName(bio) }} ({{ bio.source }})</a>
        {% endfor %}
    </div>
</div>

{% else %}

{% endif %}

{% else %}

<div class="row">
    <h1 class="col-md-12">{{ title }}</h1>
    {% if url %}
        <p class="col-md-12"><a href="{{ url }}">{{ url }}</a></p>
    {% endif %}
</div>

{% endif %}

<div id="results">
    <div class="state row">
        <div class="col-md-12">
            <span class="total">{{ __("<strong>%s</strong> prints found.", total)|raw }}</span>
            <span class="page">{{ __("Viewing prints %s to %s.", start, end) }}</span>
        </div>
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
        <a href="{{ URL(artist.artist) }}">{{ shortName(artist.artist) }}</a>
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
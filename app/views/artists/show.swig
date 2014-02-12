{% extends "../layouts/default.swig" %}

{% block title %}{{ artist.name.name }}{% endblock %}

{% block content %}
<div class="row">
    <div class="col-xs-12 artist_name">
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
    </div>
</div>

{% if artist.life.start %}
<div class="row">
    <div class="col-xs-12">
    {% if artist.life.start %}
        {% if artist.life.start_ca %}ca. {% endif %}
        {{artist.life.start}}
    {% endif %}
    &dash;
    {% if artist.life.end %}
        {% if artist.life.end_ca %}ca. {% endif %}
        {{artist.life.end}}
    {% endif %}
    {% if artist.life.current %}
        Alive
    {% endif %}
    </div>
</div>
{% endif %}
{% if artist.active.start %}
<div class="row">
    <div class="col-xs-12">
        <strong>Active:</strong>
        {% if artist.active.start %}
            {% if artist.active.start_ca %}ca. {% endif %}
            {{artist.active.start}}
        {% endif %}
        &dash;
        {% if artist.active.end %}
            {% if artist.active.end_ca %}ca. {% endif %}
            {{artist.active.end}}
        {% endif %}
        {% if artist.active.current %}
            Alive
        {% endif %}
    </div>
</div>
{% endif %}

<p>{{ bio }}</p>

<table>
{% for artist in artists %}
    <tr>
        <td>{{ artist.name.name }}</td>
        <td>{{ artist.name.kanji }}</td>
        <td>{{ artist.life.start }}</td>
        <td>{{ artist.life.end }}</td>
        <td>{{ artist.active.start }}</td>
        <td>{{ artist.active.end }}</td>
    </tr>
    <tr>
        <td colspan="6">
            <ul>
                {% for bio in artist.bios %}
                    <li>{{ bio.name.name }} ({{ bio.source }})</li>
                {% endfor %}
            </ul>
        </td>
    </tr>
{% endfor %}
</table>

{% endblock %}
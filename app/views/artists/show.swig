{% extends "../layouts/default.swig" %}

{% block title %}{{ artist.name.name }}{% endblock %}

{% block content %}
<div class="artist_details container">
<div class="row">
<div class="col-lg-4">
<table class="artist_name">
    <tr class="romaji">
        <td class="surname">{{ artist.name.surname }}&nbsp;</td>
        <td class="given">{{ artist.name.given }}</td>
        <td class="generation">&nbsp;{{ artist.name.generation }}</td>
    </tr>
    <tr class="kana">
        <td class="surname">{{ artist.name.surname_kana }}&nbsp;</td>
        <td class="given">{{ artist.name.given_kana }}</td>
    </tr>
    <tr class="kanji">
        <td class="surname">{{ artist.name.surname_kanji }}&nbsp;</td>
        <td class="given">{{ artist.name.given_kanji }}</td>
    </tr>
</table>
</div>

<div class="artist_dates col-lg-4">

{% if artist.life %}
    <p>
        {% if artist.life.start %}
            <strong>Born:</strong>
            {% if artist.life.start_ca %}ca. {% endif %}
            {{artist.life.start}}
        {% endif %}
        {% if artist.life.end %}
            <strong>Died:</strong>
            {% if artist.life.end_ca %}ca. {% endif %}
            {{artist.life.end}}
        {% endif %}
        {% if artist.life.current %}
            Alive
        {% endif %}
    </p>
{% endif %}
{% if artist.active.start %}
    <p>
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
    </p>
{% endif %}

</div>

<div class="col-lg-4">
Details
</div>
</div>

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
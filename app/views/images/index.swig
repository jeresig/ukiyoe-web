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
<img src="http://data.ukiyo-e.org/{{ image.source }}/thumbs/{{ image.imageName }}.jpg"/>
<span>{% for artist in image.artists %}
    {% if artist.artist %}
        <a href="/artist/{{ artist.artist.name.name }}">{{ artist.artist.name.name }}</a>
    {% else %}
        {{ artist.name.name }}
    {% endif %}
{% endfor %}</span>
<span>{{ image.dateCreated.start }} - {{ image.dateCreated.end }}</span>
</div>
<!--<p>{{ image.title }} by {% if image.artistNames[0] %}{{ image.artistNames[0].name }}{% endif %}</p>-->
{% endfor %}

{% endblock %}

{% block script %}
<script>
$(function() {
    $("#selectArtist").select2({
        placeholder: "Search by Artist",
        minimumInputLength: 1,
        allowClear: true,
        ajax: {
            url: "/artists/search",
            dataType: "json",
            data: function(term) {
                return {q: term};
            },
            results: function(data) {
                return {
                    results: data.matches,
                    text: function(i) {
                        return data.matches[i].name.name;
                    }
                };
            }
        }
    });

    var $startDate = $("input[name='startDate']");
    var $endDate = $("input[name='endDate']");

    $(".slider").noUiSlider({
        range: [1603, (new Date).getYear() + 1900],
        start: [$startDate.val() || 1603, $endDate.val() || (new Date).getYear() + 1900],
        step: 1,
        connect: true,
        behaviour: "drag",
        serialization: {
            resolution: 1,
            to: [$startDate, $endDate]
        }
    });
});
</script>
{% endblock %}
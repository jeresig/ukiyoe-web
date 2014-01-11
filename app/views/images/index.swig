{% extends "../layouts/default.swig" %}

{% block title %}{{ __("Index Page") }}{% endblock %}

{% block content %}
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
<span>{{ image.dateCreated.start }} - {{ image.dateCreated.end }}</span>
</div>
<!--<p>{{ image.title }} by {% if image.artistNames[0] %}{{ image.artistNames[0].name }}{% endif %}</p>-->
{% endfor %}

{% endblock %}

{% block script %}
<script>
$(function() {
    var $startDate = $("input[name='startDate']");
    var $endDate = $("input[name='endDate']");

    $(".slider").noUiSlider({
        range: [1603, (new Date).getYear() + 1900],
        start: [$startDate.val(), $endDate.val()],
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
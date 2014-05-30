{% extends "../layouts/default.swig" %}

{% block title %}{{ image.title }}{% endblock %}

{% block content %}
<div id="result" class="row">
	<div class="span8 imageholder">
		<a href="{{ match.file }}"><img src="{{ match.scaled }}"
			alt="{{ getTitle(match) }}"
			title="{{ getTitle(match) }}"/></a>
	</div>
	<div class="details span4">
		{% if match.artist %}
			<p class="row artist">
				<strong class="span1 right">{{ __("Artist:") }}</strong>
				<span class="span3"><a href="{{ URL(match.artist) }}"
					title="{{ fullName(match.artist) }}">
					{{ fullName(match.artist) }}</a></span>
			</p>
		{% endif %}
		{% if match.title %}
			<p class="row title">
				<strong class="span1 right">{{ __("Title:") }}</strong>
				<span class="span3">{{ match.title }}</span>
			</p>
		{% endif %}
		{% if match.date %}
			<p class="row date">
				<strong class="span1 right">{{ __("Date:") }}</strong>
				<span class="span3">{{ match.date }}</span>
			</p>
		{% endif %}
		{% if match.source_url %}
			<p class="row details">
				<strong class="span1 right">
					{% if match.source.commercial %}
						<small>{{ __("Details &amp;&nbsp;Prices:") }}</small>
					{% else %}
						{{ __("Details:") }}
					{% endif %}
				</strong>
				<span class="span3">
					{% if match.source.inactive %}
						<small>{{ __("Unfortunately the source of this print no longer exists.") }}</small>
					{% else if match.source.hide_links %}
						<small>{{ __("There is no way to link to this print on the source site. Please visit the source and search for the print there.") }}</small>
					{% else if match.source.title_link %}
						<small><a href="{{ match.source_url }}"
							title="{{ match.source.title_link }}">
							{{ getTitle(match) }}</a></small>
					{% else %}
						<a href="{{ match.source_url }}">
							{{ __("More information...") }}</a>
					{% endif %}
				</span>
			</p>
		{% endif %}
		{% if match.source && match.source.id != "uploads" %}
			{% if match.source.inactive %}
				<p class="row source">
					<strong class="span1 right">{{ __("Source:") }}</strong>
					<span class="span3"><a href="{{ URL(match.source) }}" title="{{ fullName(match.source) }}">
						{{ fullName(match.source) }}</a></span>
				</p>
			{% else %}
				<p class="row source">
					<strong class="span1 right">{{ __("Source:") }}</strong>
					<span class="span3"><a href="{{ match.source.url }}">
						{% if match.source.link_text %}
							{{ match.source.link_text }}
						{% else %}
							{{ fullName(match.source) }}
						{% endif %}
					</a><br/>
					<small><a href="{{ URL(match.source) }}" title="{{ fullName(match.source) }}">
						{{ __("Browse all %s prints...", match.source.count_string) }}</a></small></span>
				</p>
			{% endif %}
		{% endif %}
		{% if match.upload %}
			{% if results.length == 0 %}
				<h3>{{ __("Uh oh!") }}</h3>
				<p>{{ __("No other copies of this print have been found.") }}</p>
				<div class="hide-ja">
				<p>It might be worthwhile to copy the uploaded image URL:</p>
				<pre>{{ match.file }}</pre>
				<p>and ask the Ukiyo-e Q&amp;A community for help:</p>
				<p><a href="http://www.ukiyo-e.se/wwwboard/wwwboard.html">
					http://www.ukiyo-e.se/wwwboard/wwwboard.html</a></p>
				</div>
			{% endif %}
		{% endif %}
	</div>
</div>

<div class="row">
	{% if results.length > 0 %}
	<div class="span8">
		<h2>{{ __("Other Copies") }}
		{% if results.length > 0 %}
			<a href="" class="btn compare-all"><i class="icon-eye-open"></i> 
				{{ __("Compare Prints...") }}</a>
		{% endif %}</h2>
	</div>
	{% endif %}
	<div class="{% if results.length > 0 %}span4{% else %}span12{% endif %}">
		<h2>{{ __("Discuss This Print") }}</h2>
	</div>
</div>

<div class="row">

{% if results.length > 0 %}
<div id="results" class="span8">
	<div class="row">
	{% for item in results %}
		<div class="img span2">
			<a class="img" href="{{ URL(item) }}">
				<img src="{{ item.thumb }}"
					alt="{{ getTitle(item) }}"
					title="{{ getTitle(item) }}"/></a>
			<div class="details">
				<div class="wrap">
				{% if item.artist %}
					<a class="artist" href="{{ URL(item.artist) }}"
						title="{{ fullName(item.artist) }}">
						{{ shortName(item.artist) }}</a>
				{% endif %}
				<a class="source" href="{{ URL(item.source) }}"
					title="{{ fullName(item.source) }}">
					{{ shortName(item.source) }}</a>
				</div>
			</div>
	  </div>
	{% endfor %}
	</div>
</div>

<div id="image-holder"></div>
<div id="compare">
	<div class="compare-nav left-nav">
		<a href="" class="compare-prev">
			<i class="icon-step-backward icon-white"></i> 
			{{ __("Previous") }}</a>
		<a href="" class="compare-next">{{ __("Next") }} 
			<i class="icon-step-forward icon-white"></i></a>
	</div>
	<div class="compare-nav right-nav">
		<a href="" class="reset-zoom"><i class="icon-zoom-out icon-white"></i> 
			{{ __("Reset Zoom") }}</a>
		<a href="" class="compare-close"><i class="icon-remove icon-white"></i> 
			{{ __("Close") }}</a>
	</div>
	<div class="details">
		<a href="" class="source"></a>:
		<a href="" class="artist"></a> -
		<a href="" class="title"></a>
	</div>
	<canvas id="compare-canvas"></canvas>
</div>
{% endif %}

<div id="disqus_thread" class="{% if results.length > 0 %}span4{% else %}span12{% endif %}"></div>

</div>

{% if results.length > 0 && match.upload %}
<div class="row">
	<div class="span8">
	<h3>{{ __("Learn More") }}</h3>
	{% for group in groups %}
		<p><strong><a href="{{ URL(group.source) }}">
			{{ fullName(group.source) }}</a></strong></p>
		<ul>
		{% for item in group.items %}
			<li><a href="{{ item.source_url }}">{{ item.source_url }}</a></li>
		{% endfor %}
		</ul>
	{% endfor %}
	</div>
</div>
{% endif %}

<script type="text/javascript">
var matchData = {{ match|json_encode|raw }};
var results = {{ results|json_encode|raw }};
</script>

<script type="text/javascript">
var disqus_shortname = 'ukiyoe';

(function() {
	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();
</script>
{% endblock %}
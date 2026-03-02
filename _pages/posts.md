---
title: "Posts"
layout: archive
permalink: /posts/
author_profile: false
---

{% include base_path %}

{% for post in site.posts %}
  {% include archive-single.html type="list" %}
{% endfor %}

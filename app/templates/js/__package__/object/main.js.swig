require.config({
    baseUrl: '/static/js',
    map: {
        '*': {
            // 这个是一个很脏的把戏， 因为压缩时，r.js必须依靠text.js, 所以不能
            // 将text设置成为"empty:", 为了避免将text.js压缩到r.js中， 必须将其
            // 加入到excludes中, 具体看https://github.com/jrburke/r.js/issues/221
            {% for lib in ['text', 'css'] %}
            '{{ lib }}': '{{ urlRoot }}{{ scriptsMap[lib] }}.js',
            {% endfor %}
        }
    },
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        {% for lib in ['css', 'text', 'jquery', 'semantic-ui', 'sweetalert', 'toastr'] %}
        '{{ lib }}': '{{ urlRoot }}{{ scriptsMap[lib] }}',
        {% endfor %}
    },
    shim: {
        {% for lib in ['semantic-ui', 'sweetalert', 'toastr'] %}
        '{{ lib }}': {{ JSON.stringify(shimsMap[lib]) }},
        {% endfor %}
    }
});

require(['<%= packageName %>/object/app'], function () {});

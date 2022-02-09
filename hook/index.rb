r = Nginx::Request.new
r.content_type = "text/html"

Docker::Container.expire_cache!
me = Docker::Container.me!
containers = Docker::Container.all - [me]

not_connected_networks = (containers.flat_map(&:networks) - me.networks)
not_connected_networks.each do |n|
  n.connect(me)
end
if not_connected_networks.any?
  Docker::Container.expire_cache!
  me = Docker::Container.me!
  containers = Docker::Container.all - [me]
end
containers = containers.select {|c| c.reachable_from?(me) }.sort_by(&:name)

Nginx.echo <<-HTML
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <title>Yaichi</title>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css" type="text/css" />
    <link rel="icon" type="image/png" href="/favicon.png">

    <style>
      .switcher {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: auto;
        margin-bottom: 0;
        padding: 0.75rem;
        border-radius: 2rem;
        box-shadow: var(--card-box-shadow);
        line-height: 1;
        text-align: right;
      }

      .switcher::after {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 0.15rem solid currentColor;
        border-radius: 50%;
        background: linear-gradient(to right,currentColor 0,currentColor 50%,transparent 50%);
        content: "";
        vertical-align: bottom;
        transition: transform var(--transition);
      }
    </style>
  </head>
  <body style="padding:20px">
    <a href="https://github.com/mtsmfm/yaichi">
      <img style="position: absolute; top: 0; right: 0; border: 0;"
        src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
        alt="Fork me on GitHub"
      data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png">
    </a>
    <h2>Proxy-able Containers</h2>
    <ul>
    #{
      containers.flat_map do |c|
        me.exposed_ports.select {|_, local| c.listening?(me, local) }.map do |remote, local|
          "<li><a href='http://#{c.host}.#{r.hostname}:#{remote}' target='_blank'>#{c.name} (#{remote}:#{local})</a></li>"
        end
      end.join("\n")
    }
    </ul>
    <h2>All Containers</h2>
    <ul>
    #{
      containers.map {|c| "<li>#{c.name}</li>" }.join("\n")
    }
    </ul>

    <button class="contrast switcher" onclick="toggleTheme()"></button>

    <script>
      function toggleTheme() {
        if (Cookies.get('theme') == 'dark') {
          setTheme('light')
        } else {
          setTheme('dark')
        }
      }

      function setTheme(theme) {
        Cookies.set('theme', theme)
        document.querySelector('html').setAttribute('data-theme', theme)
      }

      setTheme(Cookies.get('theme') || 'light')
    </script>
  </body>
</html>
HTML

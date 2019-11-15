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
    <link rel="stylesheet" href="https://cdn.rawgit.com/andyferra/2554919/raw/2e66cabdafe1c9a7f354aa2ebf5bc38265e638e5/github.css" type="text/css" />
    <link rel="icon" type="image/png" href="/favicon.png">
  </head>
  <body>
    <a href="https://github.com/mtsmfm/yaichi">
      <img style="position: absolute; top: 0; right: 0; border: 0;"
        src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
        alt="Fork me on GitHub"
      data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png">
    </a>
    <h1>Proxy-able Containers</h1>
    <ul>
    #{
      containers.flat_map do |c|
        me.exposed_ports.select {|_, local| c.listening?(me, local) }.map do |remote, local|
          "<li><a href='http://#{c.host}.#{r.hostname}:#{remote}' target='_blank'>#{c.name} (#{remote}:#{local})</a></li>"
        end
      end.join("\n")
    }
    </ul>
    <h1>All Containers</h1>
    <ul>
    #{
      containers.map {|c| "<li>#{c.name}</li>" }.join("\n")
    }
    </ul>
  </body>
</html>
HTML

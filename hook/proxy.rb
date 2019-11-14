r = Nginx::Request.new
c = Nginx::Connection.new
me = Docker::Container.me!

if container = Docker::Container.find_by_hostname(r.hostname)
  not_connected_networks = (container.networks - me.networks)
  not_connected_networks.each do |n|
    n.connect(me)
  end
  if not_connected_networks.any?
    Docker::Container.expire_cache!
    me = Docker::Container.me!
    container = Docker::Container.find_by_hostname(r.hostname)
  end

  "#{container.ip_address(me)}:#{c.local_port}"
end

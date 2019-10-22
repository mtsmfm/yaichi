r = Nginx::Request.new
c = Nginx::Connection.new
me = Docker::Container.me!

if (container = Docker::Container.find_by_fqdn(r.hostname)) && container.listening?(me, c.local_port.to_i)
  "#{container.ip_address(me)}:#{c.local_port}"
end

r = Nginx::Request.new
c = Nginx::Connection.new
me = Docker::Container.me

if container = Docker::Container.find_by_fqdn(r.hostname)
  container.allow_access!(me)

  "#{container.ip_address(me)}:#{c.local_port}"
end

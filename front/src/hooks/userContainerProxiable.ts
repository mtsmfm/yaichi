import icon from "../../data/favicon.png";
import { useFetch } from "./useFetch";

const notifyMe = () => {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      const containerName = "foo-bar";
      const notification = new Notification(`${containerName} is ready!`, {
        icon,
        requireInteraction: true
      });
      notification.onclick = () => {
        window.focus();
        location.reload();
        notification.close();
      };
    }
  });

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
};

interface Container {
  fqdn: string;
}

export const useContainerProxiable = (fqdn: string) => {
  const { data, loading } = useFetch<Container[]>({
    url: "/containers/proxiable",
    interval: 1000,
    polling: true
  });

  return !!(!loading && data && data.some(c => c.fqdn === fqdn));
};

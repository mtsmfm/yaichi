import icon from "../../data/favicon.png";
import { useFetch } from "./useFetch";
import { useEffect } from "react";

const notifyReady = (fqdn: string, port: number) => {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      const notification = new Notification(`${fqdn}:${port} is ready!`, {
        icon,
        requireInteraction: true
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      location.reload();
    }
  });
};

interface Container {
  id: string;
  name: string;
  fqdn: string;
  available_ports: Array<{
    remote: number;
    local: number;
  }>;
  reacable: boolean;
}

export const useFetchContainers = (
  arg: Omit<Parameters<typeof useFetch>[0], "url">
) => useFetch<Container[]>({ url: "/containers", ...arg });

export const useContainerAvailableNotification = (
  fqdn: string,
  port: number
) => {
  const { data, loading } = useFetchContainers({
    interval: 3000,
    polling: true
  });

  const ready =
    !loading &&
    data &&
    data.some(
      c =>
        c.fqdn === fqdn &&
        c.available_ports.some(({ remote }) => remote === port)
    );

  useEffect(() => {
    if (ready) {
      notifyReady(fqdn, port);
    }
  }, [ready]);
};

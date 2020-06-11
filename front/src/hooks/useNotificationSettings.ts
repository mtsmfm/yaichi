import { useState, useEffect, useRef } from "react";

const DB_NAME = "yaichi";
const OBJECT_STORE_NAME = "notification_settings";

interface Setting {
  name: string;
}

export const useNotificationSettings = () => {
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState<Setting[]>(
    []
  );
  const db = useRef<IDBDatabase>();

  useEffect(() => {
    new Promise<Setting[]>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = () => {
        reject("Database failed to open");
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        const objectStore = db.createObjectStore(OBJECT_STORE_NAME, {
          keyPath: "name"
        });

        objectStore.createIndex("name", "name", { unique: true });
      };

      request.onsuccess = () => {
        db.current = request.result;

        const r = db.current
          .transaction(OBJECT_STORE_NAME, "readonly")
          .objectStore(OBJECT_STORE_NAME)
          .getAll();

        r.onsuccess = () => {
          resolve(r.result);
        };
      };

      request.onerror = () => {
        reject("Failed to read");
      };
    }).then(settings => {
      setLoading(false);
      setNotificationSettings(settings);
    });
  }, []);

  const add = (name: string) => {
    setNotificationSettings([...notificationSettings, { name }]);

    if (db.current) {
      db.current
        .transaction(OBJECT_STORE_NAME, "readwrite")
        .objectStore(OBJECT_STORE_NAME)
        .add({ name });
    }
  };

  const remove = (name: string) => {
    setNotificationSettings(
      notificationSettings.filter(({ name: n }) => n !== name)
    );

    if (db.current) {
      db.current
        .transaction(OBJECT_STORE_NAME, "readwrite")
        .objectStore(OBJECT_STORE_NAME)
        .delete(name);
    }
  };

  return {
    loading,
    notificationSettings,
    add,
    remove
  };
};

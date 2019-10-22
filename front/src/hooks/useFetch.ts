import { useEffect, useState } from "react";

export const useFetch = <T extends {}>({
  url,
  polling,
  interval
}: {
  url: string;
  polling?: boolean;
  interval?: number;
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();
  const [successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    let count = 0;

    const main = async () => {
      setLoading(true);
      const json = await (await fetch(url)).json();
      setData(json);
      setLoading(false);
      setSuccessCount(++count);
    };

    main();

    if (polling && interval) {
      const id = setInterval(main, interval);

      return () => {
        clearInterval(id);
      };
    }
  }, []);

  return { loading, data, successCount };
};

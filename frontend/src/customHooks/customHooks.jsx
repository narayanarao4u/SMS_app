import { useEffect, useState } from "react";

export function useFetchAPI(url, options = {}, fireURL = true) {
  const [data, setData] = useState();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setData(undefined);
    setIsError(false);
    setIsLoading(true);

    console.log("url : ", url, options, fireURL);

    const controller = new AbortController();
    const fetchData = () => {
      fetch(url, { signal: controller.signal, ...options })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then(setData)
        .catch((e) => {
          // console.log(e);
          if (e.name === "AbortError") return;
          setIsError(true);
        })
        .finally(() => {
          if (controller.signal.aborted) return;
          setIsLoading(false);
        });
    };

    if (url && fireURL) {
      fetchData();
    } else {
      setIsLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [url, fireURL]);

  return { data, isError, isLoading };
}

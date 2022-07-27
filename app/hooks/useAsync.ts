import React from "react";

/**
 * @enum {string}
 */
export const AsyncStatus = {
  Loading: "loading",
  Idle: "idle",
  Success: "success",
  Error: "error",
};

export const useAsync = (asyncFunction: Function, immediate = false) => {
  const [status, setStatus] = React.useState<string>("idle");
  const [value, setValue] = React.useState<any | null>(null);
  const [error, setError] = React.useState<any | null>(null);
  const mounted = React.useRef(false);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = React.useCallback(
    (...args: any) => {
      setStatus(AsyncStatus.Loading);
      setValue(null);
      setError(null);

      return asyncFunction(...args)
        .then((response: any) => {
          if (!mounted.current) return;

          if (!response.ok) throw new Error(response?.message || "Request failed");

          return response;
        })
        .then((response: any) => {
          setValue(response);
          setStatus(AsyncStatus.Success);
        })
        .catch((err: any) => {
          if (process.env.NODE_ENV === "development") {
            /* */
          }

          if (!mounted.current) return;

          setError(err);
          setStatus(AsyncStatus.Error);
        });
    },
    [asyncFunction]
  );

  const reset = React.useCallback(() => {
    setStatus(AsyncStatus.Idle);
    setValue(null);
    setError(null);
  }, []);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  React.useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return {
    execute,
    status,
    value,
    error,
    reset,
    isError: status === AsyncStatus.Error,
    isIdle: status === AsyncStatus.Idle,
    isLoading: status === AsyncStatus.Loading,
    isSuccess: status === AsyncStatus.Success,
  };
};

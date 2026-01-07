import { useState, useEffect, useRef } from 'react';

function useWebWorker(config: { url?: string, worker?: Worker }) {
  const {
    url,
    worker: workerContext,
  } = config;
  const workerContainer = useRef<{
    worker?: Worker,
    shouldTerminate?: boolean,
  }>({});

  const [message, setMessage] = useState<{ data: unknown, error: Error | string | undefined }>({
    data: undefined,
    error: undefined,
  });

  /**
   *  OnMessage event handler
   *  which gets triggered when worker sends a message
   */
  function onMessage(payload: { data: unknown }) {
    const { data } = payload;

    setMessage({
      data,
      error: undefined,
    });
  }

  /**
   *  OnError event handler
   *  which gets triggered when worker throws some error
   */
  function onError(error: Error) {
    setMessage({
      data: undefined,
      error,
    });
  }

  /**
   *  OnErrorEvent handler for worker error events
   *  Wraps onError to properly handle ErrorEvent objects
   */
  function onErrorEvent(errorEvent: ErrorEvent) {
    onError(errorEvent.error);
  }

  /**
   *  if url is passed a new webworker is created using that url
   *  else it will use the worker which was passed in config
   */
  function createWebWorker() {
    const { current } = workerContainer;

    if (url) {
      current.worker = new Worker(url);
    } else if (workerContext) {
      current.worker = workerContext;
      current.shouldTerminate = false;
    }

    return current.worker;
  }

  /**
   * Creates a new WebWorker and adds event handler to the same
   */
  function setupWebWorker() {
    const worker = createWebWorker();

    if (!worker) {
      setMessage({
        data: undefined,
        error: 'Either Worker url or worker should be passed',
      });
    }

    if (worker) {
      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onErrorEvent);
    }
  }

  /**
   *  postData message which posts data to the webworker
   */
  function postData(data: unknown) {
    const { worker } = workerContainer.current;

    if (!worker) {
      setMessage({
        data: undefined,
        error: new Error('Worker not Initialized'),
      });
    } else {
      worker.postMessage(data);
    }
  }

  /**
   * Remove onMessage and onError event handlers
   * and then terminate the worker
   */
  function terminateWebWorker() {
    const { current } = workerContainer;
    const { worker, shouldTerminate } = current;

    if (worker) {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onErrorEvent);

      if (shouldTerminate) {
        worker.terminate();
      }
      workerContainer.current = {};
    }
  }

  useEffect(() => {
    setupWebWorker();
    return () => {
      terminateWebWorker();
    };
  }, [url, workerContext]);

  return [message.data, postData, message.error];
}

/**
 *  pass an URL of the web worker
 */
export const useWebWorkerFromUrl = (url: string) => useWebWorker({ url });

/**
 * pass a string javascript script
 */
export const useWebWorkerFromScript = (script: string) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const blob = new Blob([script], { type: 'text/javascript' });
    setUrl(window.URL.createObjectURL(blob));

    return () => {
      if (url) {
        window.URL.revokeObjectURL(url);
      }
    };
  }, [script]);

  return useWebWorker({ url });
};

/**
 *  use existing web worker
 */
export const useWebWorkerFromWorker = (worker: Worker) => useWebWorker({ worker });

export default useWebWorker;

declare function useWebWorker(config: {
    url?: string;
    worker?: Worker;
}): unknown[];
/**
 *  pass an URL of the web worker
 */
export declare const useWebWorkerFromUrl: (url: string) => unknown[];
/**
 * pass a string javascript script
 */
export declare const useWebWorkerFromScript: (script: string) => unknown[];
/**
 *  use existing web worker
 */
export declare const useWebWorkerFromWorker: (worker: Worker) => unknown[];
export default useWebWorker;

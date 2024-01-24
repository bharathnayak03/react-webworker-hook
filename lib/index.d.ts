declare function useWebWorker(config: {
    url?: string;
    worker?: Worker;
}): any[];
/**
 *  pass an URL of the web worker
 */
export declare const useWebWorkerFromUrl: (url: string) => any[];
/**
 * pass a string javascript script
 */
export declare const useWebWorkerFromScript: (script: string) => any[];
/**
 *  use existing web worker
 */
export declare const useWebWorkerFromWorker: (worker: Worker) => any[];
export default useWebWorker;

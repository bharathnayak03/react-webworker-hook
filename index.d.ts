
declare module "react-webworker-hook" {

    type retVal = [unknown, Function, unknown];

    export function useWebWorkerFromWorker(worker: Worker): retVal;

    export function useWebWorkerFromScript(script: string): retVal;

    export function useWebWorkerFromUrl(url: string): retVal;

    export default function useWebWorker(config: {
        url?: string,
        worker?: Worker
    }): retVal;

}
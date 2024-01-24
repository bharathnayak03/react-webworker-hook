# react-webworker-hook
A react custom hook to communicate with web worker. just specify the web worker url or a script that you want webworker to run and you will get access to any message, error it sends and postMessage handler which is used to communicate with web worker

### Installation
```
npm install --save react-webworker-hook
```

### Usage
a quick sample here https://codesandbox.io/p/sandbox/react-webworker-hook-example-6xt8rm

```js
import React, { useState } from "react";
import useWebWorker from "react-webworker-hook";

function GenerateFibonacci() {
  const [data = 0, postData] = useWebWorker({
    url: "./webworker_example.js"
  });
  const [count, setCount] = useState(0);

  return (
    <div>
      {`fibonacci for ${count}: ${data}`}
      <button
        onClick={() => {
          setCount(count + 1);
          postData(count);
        }}
      >
        Generate
      </button>
    </div>
  );
}

export default GenerateFibonacci;
```

It also comes with other helper functions like
when we have a small script which should be deployed into webworker 
```js
const [data, postData, error] = useWebWorkerFromScript(`
const fib = n => (n < 2 ? n : fib(n - 1) + fib(n - 2));

onmessage = ({ data }) => {
  postMessage(fib(data));
};

`)
```
pass url of a web worker, webworker should be served from the same origin
```js
const [data, postData, error] = useWebWorkerFromUrl('./webworker_example.js');
```
when we have an existing worker and it should be used through hook
```js
const [data, postData, error] = useWebWorkerFromWorker('./webworker_example.js');
```

## API
### `useWebWorker` takes following arguments
a config object with either `url` or `worker` object
### `useWebWorker` provides following values
- `data` - data which has been sent by webworker
- `postMessage` - handler which is used to communicatew with webworker
- `error` - which will contain an error object if thrown by web worker







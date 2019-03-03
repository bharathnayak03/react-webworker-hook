"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.useWebWorkerFromWorker = exports.useWebWorkerFromScript = exports.useWebWorkerFromUrl = void 0;

var _react = require("react");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useWebWorker(config) {
  var url = config.url,
      workerContext = config.worker;
  var workerContainer = (0, _react.useRef)({});

  var _useState = (0, _react.useState)({
    data: undefined,
    error: undefined
  }),
      _useState2 = _slicedToArray(_useState, 2),
      message = _useState2[0],
      setMessage = _useState2[1];
  /**
   *  OnMessage event handler
   *  which gets triggered when worker sends a message
   */


  function onMessage(payload) {
    var data = payload.data;
    setMessage({
      data: data,
      error: undefined
    });
  }
  /**
   *  OnError event handler
   *  which gets triggered when worker throws some error
   */


  function onError(error) {
    setMessage({
      data: null,
      error: error
    });
  }
  /**
   *  if url is passed a new webworker is created using that url
   *  else it will use the worker which was passed in config
   */


  function createWebWorker() {
    var current = workerContainer.current;

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
    var worker = createWebWorker();

    if (!worker) {
      setMessage({
        data: undefined,
        error: 'Either Worker url or worker should be passed'
      });
    }

    if (worker) {
      worker.addEventListener('message', onMessage);
      worker.addEventListener('error', onError);
    }
  }
  /**
   *  postData message which posts data to the webworker
   */


  function postData(data) {
    var worker = workerContainer.current.worker;

    if (!worker) {
      setMessage({
        data: undefined,
        error: new Error('Worker not Initialized')
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
    var current = workerContainer.current;
    var worker = current.worker,
        shouldTerminate = current.shouldTerminate;

    if (worker) {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);

      if (shouldTerminate) {
        worker.terminate();
      }

      workerContainer.current = null;
    }
  }

  (0, _react.useEffect)(function () {
    setupWebWorker();
    return function () {
      terminateWebWorker();
    };
  }, [url, workerContext]);
  return [message.data, postData, message.error];
}
/**
 *  pass an URL of the web worker
 */


var useWebWorkerFromUrl = function useWebWorkerFromUrl(url) {
  return useWebWorker({
    url: url
  });
};
/**
 * pass a string javascript script
 */


exports.useWebWorkerFromUrl = useWebWorkerFromUrl;

var useWebWorkerFromScript = function useWebWorkerFromScript(script) {
  var _useState3 = (0, _react.useState)(),
      _useState4 = _slicedToArray(_useState3, 2),
      url = _useState4[0],
      setUrl = _useState4[1];

  (0, _react.useEffect)(function () {
    var blob = new Blob([script], {
      type: 'text/javascript'
    });
    setUrl(window.URL.createObjectURL(blob));
    return function () {
      window.URL.revokeObjectURL(url);
    };
  }, [script]);
  return useWebWorker({
    url: url
  });
};
/**
 *  use existing web worker
 */


exports.useWebWorkerFromScript = useWebWorkerFromScript;

var useWebWorkerFromWorker = function useWebWorkerFromWorker(worker) {
  return useWebWorker({
    worker: worker
  });
};

exports.useWebWorkerFromWorker = useWebWorkerFromWorker;
var _default = useWebWorker;
exports.default = _default;
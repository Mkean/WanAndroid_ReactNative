import HttpConfig, {HttpConst} from './HttpConfig';

import {
  dateFormat,
  isEmpty,
  isFullUrl,
  isFunc,
  objHasKey,
  selfOr,
} from '../utils';
import HttpRequest from './HttpRequest';

export function getParams(data) {
  let {
    headerSetFunc,
    paramSetFunc,
    baseUrl,
    commonParam = {},
    encodeComponent,
    contentType: configContentType,
  } = HttpConfig[data.serverTag];
  let newUrl,
    paramArray = [],
    result = {...data};

  let {
    url,
    param = {},
    method,
    contentType,
    header = {},
    enableHeaderSetFunc,
    enableParamSetFunc,
  } = data;

  result.requestInit.method = method;
  result.requestInit.headers = {
    'Content-Type': selfOr(contentType, configContentType),
  };

  enableHeaderSetFunc &&
    headerSetFunc &&
    headerSetFunc(result.requestInit.headers, data);
  result.requestInit.headers = {...result.requestInit.headers, ...header};
  result.requestInit.dateTime = new Date().valueOf();

  const finalContentType = result.requestInit.headers['Content-Type'];
  const needEncoded = finalContentType.includes(
    HttpConst.CONTENT_TYPE_URLENCODED,
  );
  enableParamSetFunc && paramSetFunc && paramSetFunc(commonParam, data);

  let finalParam = encodeParams(
    commonParam,
    param,
    encodeComponent,
    needEncoded,
  );
  XPackage(finalParam, paramArray);

  newUrl = isFullUrl(url) ? url : baseUrl + url;
  if (data.formData) {
    if (!finalContentType.includes(HttpConst.CONTENT_TYPE_FORM_DATA)) {
      result.requestInit.headers = {
        'Content-type': HttpConst.CONTENT_TYPE_FORM_DATA,
      };
    }
    result.requestInit.body = XPackage(finalParam, data.formData);
  } else {
    if (finalContentType.includes(HttpConst.CONTENT_TYPE_JSON)) {
      result.requestInit.body = JSON.stringify(finalParam);
    } else if (finalContentType.includes(HttpConst.CONTENT_TYPE_FORM_DATA)) {
      result.requestInit.body = XPackage(finalParam, new FormData());
    } else {
      result.requestInit.body = paramArray.join('&');
    }
  }

  if (HttpConst.Methods.has(method)) {
    newUrl = newUrl + (newUrl.includes('?') ? '&' : '?') + paramArray.join('&');
    delete result.requestInit.body;
  }
  result.url = newUrl;
  return result;
}

function encodeParams(commonParam, param, encodeComponent, needEncoded) {
  if (encodeComponent && needEncoded) {
    if (Array.isArray(param)) {
      param.map(item => encodeURLComponent(item));
    } else {
      param = {...commonParam, ...param};
      encodeURLComponent(param);
    }
  } else {
    if (Array.isArray(param)) return param;
    param = {...commonParam, ...param};
  }
  return param;
}

function encodeURLComponent(param) {
  if (Array.isArray(param)) return;
  for (let keyStr in param) {
    if (param.hasOwnProperty(keyStr)) {
      let value = param[keyStr];
      if (typeof value === 'string') {
        param[keyStr] = encodeURIComponent(value);
      }
    }
  }
}

export function parseData(data, result, callback) {
  let {parseDataFunc} = HttpConfig[data.serverTag],
    message = '';
  let {success, response, json, status, error} = result;
  message = getErrorMsg(error, status) + ' => ' + data.url;
  let finalResult = {
    isSuccess: success,
    data: json,
    message: message,
    code: status,
    response: response,
  };

  if (isFunc(parseDataFunc)) {
    let {rawData, pureText} = data;
    if (rawData || pureText) {
      callback(finalResult);
    } else {
      parseDataFunc(finalResult, data, callback);
    }
  } else {
    callback(finalResult);
  }
}

export function getErrorMsg(error, status) {
  let {statusDesc} = HttpConst,
    message = '';
  if (error) {
    message = selfOr(error.message, selfOr(statusDesc[status]));
    message = selfOr(message, error.message + ' code: ' + status);
  } else {
    message = ' code: ' + status;
  }
  return message;
}

export function XPackage(origin, target) {
  if (isEmpty(origin) || !objHasKey(origin)) {
    return target;
  }
  if (Array.isArray(target)) {
    Object.keys(origin).forEach(key => target.push(key + '=' + origin[key]));
  } else if (target instanceof FormData) {
    Object.keys(origin).forEach(key => target.append(key, origin[key]));
  }
  return target;
}

export function XRequestLog(url, apiName, params, response, tempResult) {
  if (response && isEmpty(response._bodyText) && isEmpty(tempResult)) {
    let reader = new FileReader();
    reader.addEventListener('loadend', () => {
      if (isEmpty(reader.result)) {
        console.log('Request read failed ==>');
      } else {
        XRequestLog(url, apiName, params, response, reader.result);
      }
    });
    reader.readAsText(response._bodyBlob);
  } else {
    console.log('=====Interface=====>' + apiName);
    console.log('=====Request Url =====>' + url);
    console.log('=====Request Method=====>' + params.method);
    console.log('=====Request Header=====>' + JSON.stringify(params.headers));
    if (!isEmpty(params.body)) {
      if (params.body instanceof FormData) {
        console.log('=====Request Body=====>' + JSON.stringify(params.body));
      } else {
        console.log('=====Request Body=====>' + params.body);
      }
    }

    response && console.log('=====Status Code=====>' + response.status);
    response &&
      console.log(
        '=====Http Response=====>' +
          (isEmpty(tempResult) ? response._bodyText : tempResult),
      );
    let startTime = params.dateTime;

    if (!isEmpty(startTime)) {
      console.log(
        '=====Request Time=====>' +
          dateFormat(new Date(startTime), 'yyyy-MM-dd hh:mm:ss'),
      );
      console.log(
        '=====Cost Time=====>' + (new Date().valueOf() - startTime),
        'ms',
      );
    } else {
      if (response) {
        startTime = response.headers.map.date;
        console.log(
          '=====Request Time=====>' +
            dateFormat(new Date(startTime), 'yyyy-MM-dd hh:mm:ss'),
        );
        console.log(
          '=====Cost Time=====>' + (new Date().valueOf() - startTime),
          'ms',
        );
      }
    }
  }
  console.log('\n'.repeat(5));
}

export function XHttp(serverTag = HttpConst.ServerTag) {
  return new HttpRequest(serverTag);
}

export function XHttpConfig(serverTag) {
  return new HttpConfig(serverTag);
}

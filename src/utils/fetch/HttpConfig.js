import {Platform} from 'react-native';

export const Constant = {
  networkAvailable: true,
  networkInfo: {},
};

export const HttpConst = {
  TIMEOUT: 30_000, // default timeout
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_FORM_DATA: 'multipart/form-data',
  CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded',
  NETWORK_INVALID: 'Network is not available',
  Methods: new Set(['GET', 'DELETE', 'OPTIONS']), // request mode without body
  Credentials: {
    same_origin: 'same-origin', // 不发送跨域 cookie，default
    include: 'include', //  持久 cookie，跨域
    omit: 'omit', // 不包含 cookie
  },
  ServerTag: 'TAG', // server protocol tag
  statusDesc: {
    403: 'The server is not allowed to reject the request #403',
    404: 'The server could not find the requested page #404',
    405: 'Disable the method specified in the request #405',
    406: 'A web page that cannot respond to a request using the content feature of the request #406',
  },
};

export default class HttpConfig {
  constructor(serverTag = HttpConst.ServerTag) {
    this.timeout = HttpConst.TIMEOUT;
    this.contentType = HttpConst.CONTENT_TYPE_JSON;
    this.credentials = HttpConst.Credentials.same_origin;
    this.encodeComponent = false;
    HttpConfig[serverTag] = this;
  }

  initBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
    return this;
  }

  initTimeout(timeout) {
    this.timeout = timeout;
    return this;
  }

  initLogOn(logOn) {
    this.logOn = logOn;
    return this;
  }

  initCredentials(credentials) {
    this.credentials = credentials;
    return this;
  }

  initHeaderSetFunc(headerSetFunc) {
    this.headerSetFunc = headerSetFunc;
    return this;
  }

  initParamSetFunc(paramSetFunc) {
    this.paramSetFunc = paramSetFunc;
    return this;
  }

  initParseDataFunc(parseDataFunc) {
    this.parseDataFunc = parseDataFunc;
    return this;
  }

  initContentType(contentType) {
    this.contentType = contentType;
    return this;
  }

  initLoadingFunc(loadingFunc) {
    this.globalLoadingFunc = loadingFunc;
    return this;
  }

  initEncodeURIComponent(encodeComponent) {
    this.encodeComponent = encodeComponent;
    return this;
  }

  initNetworkExceptionFunc(NetInfo, networkExceptionFunc) {
    this.listenNetwork(NetInfo);
    this.networkExceptionFunc = networkExceptionFunc;
    return this;
  }

  listenNetwork(NetInfo) {
    NetInfo.addEventListener(state => {
      Constant.networkAvailable =
        Platform.OS === 'android'
          ? !!state.isInternetReachable
          : !!state.isConnected;
      Constant.networkInfo = state;
    });
  }
}

export function isEmpty(obj) {
  if (obj === undefined || obj == null) {
    return true;
  }
  if (Array.isArray(obj) && obj.length === 0) {
    // array
    return true;
  } else {
    if (typeof obj === 'string' && obj.trim() === '') {
      return true;
    }
  }
  return false;
}

/**
 *
 * @param {*} self
 * @param {*} another
 *
 * @return Returns itself or another object
 */
export function selfOr(self, another = null) {
  if (Array.isArray(self)) {
    return !isEmpty(self) ? self : [];
  } else {
    return !isEmpty(self) ? self : another;
  }
}

export function emptyTip(content, tip) {
  let empty = isEmpty(content) || content === false;
  empty && console.warn(tip);
  return empty;
}

export function isFullUrl(url) {
  if (isEmpty(url)) {
    return false;
  }
  let newUrl = url.toLowerCase();
  return newUrl.startsWith('http');
}

/**
 * Determines whether an object has properties
 *
 * @param {*} obj
 */
export function objHasKey(obj) {
  if (isEmpty(obj)) {
    return false;
  }

  return Object.keys(obj).length > 0;
}

export function isFunc(func) {
  return func && typeof func === 'function';
}

export function dateFormat(
  dateTime = new Date().valueOf(),
  format = 'yyyy-MM-dd',
) {
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateTime)) {
    return dateTime;
  }
  let date = new Date(dateTime);
  let o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // Season
    S: date.getMilliseconds(), // ms
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    );
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length),
      );
    }
  }
  return format;
}

String.prototype.equals = function (str, ignoreCase = true) {
  // Compare two strings to see if they are the same
  if (typeof str === 'string') {
    return ignoreCase
      ? str.toLowerCase() === String(this).toLowerCase()
      : String(this) === str;
  }
  return false;
};

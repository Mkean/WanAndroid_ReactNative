import {XHttp} from '../../fetch';

/**
 * 登录
 *
 * @param username
 * @param password
 * @returns {Promise | Promise<unknown>}
 */
export function login(username, password) {
  return XHttp()
    .url('user/login')
    .param({
      username,
      password,
    })
    .execute('POST');
}

/**
 * 注册
 *
 * @param username
 * @param password
 * @returns {Promise | Promise<unknown>}
 */
export function register(username, password) {
  return XHttp()
    .url('user/register')
    .param({
      username,
      password,
      repassword: password,
    })
    .execute('POST');
}

/**
 * 退出
 *
 * @returns {Promise | Promise<unknown>}
 */
export function logout() {
  return XHttp().url('user/logout/json').execute();
}

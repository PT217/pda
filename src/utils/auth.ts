// 获取token
export const getTokenFromStorage = () => uni.getStorageSync('authInfoToken') || '';

// 设置token
export const setTokenToStorage = (token: string) => uni.setStorageSync('authInfoToken', token);

// 设置用户信息
export const setUserInfoToStorage = (userInfo: any) => uni.setStorageSync('authInfoUserInfo', JSON.stringify(userInfo));

// 获取用户信息
export const getUserInfoFromStorage = () =>
  (uni.getStorageSync('authInfoUserInfo') && JSON.parse(uni.getStorageSync('authInfoUserInfo'))) || {};

// 获取用户id
export const getUserIdFromStorage = () => getUserInfoFromStorage()?.userId || '';

// 获取用户剩余积分
export const getUserPointFromStorage = () => getUserInfoFromStorage()?.residualIntegral || 0;

// 设置storage
export const setStorage = (key: string, value: any) => uni.setStorageSync(key, value);

// 获取storag
export const getStorage = (key: string) => uni.getStorageSync(key);

export const removeAllStorage = () => uni.clearStorage();

export const removeStorage = (key: string) => uni.removeStorageSync(key);

// 判断是否登录
export const isLogin = () => {
  // console.log('token-------:', getTokenFromStorage());
  return !!getTokenFromStorage();
};


// 前往登录
export const toLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index',
  });
};

import { defineStore } from 'pinia';
import { login } from '@/api/index';
import {
  getStorage,
  getUserInfoFromStorage,
  isLogin,
  removeStorage,
  setStorage,
  setTokenToStorage,
  setUserInfoToStorage,
  toLogin
} from '@/utils/auth';
import { sm3 } from "sm-crypto";


export const useIndexStore = defineStore('index', {
  state: (): any => {
    return {
      form: {
        dlbm: '',
        kl: '',
      },
    };
  },
  actions: {
    /** 首页数据初始化 */
    async init() {

      // 如果未登录及跳转至登录页面
      if (!isLogin()) {
        toLogin();
        return;
      }
      // 如果是从登录页面跳转过来的,或者缓存中没有数据,则重新获取数据
      // 定制onload效果
    },
    // 登录
    async handleLogin() {
      uni.switchTab({
        url: '/pages/index/index',
      });
      uni.showLoading({
        title: '登录中...',
      });
      const res: any = await login({
        dlbm: this.form.dlbm,
        kl: sm3(this.form.kl).toUpperCase(),
      })

      console.log(res)

      if (res.code === 0) {
        setTokenToStorage(res.data.token);
        uni.showToast({
          title: `登录成功`,
          icon: 'none',
          duration: 2000,
          success() {
            setTimeout(async () => {
              uni.hideLoading();
              uni.switchTab({
                url: '/pages/index/index',
              });
            }, 500);
          },
        });
      } else {
        uni.hideLoading();
        uni.showToast({
          title: res.message,
          icon: 'none',
        });
      }
    },
    //  获取用户信息
    userInfo() {
      return new Promise((resolve, reject) => {
        // getUserInfo().then(async (res: any) => {
        //   setUserInfoToStorage(res.user);
        //   await updateUserPoint();
        //   resolve(res);
        // });
      });
    },
    loginFormState() {
      return this.form.dlbm === '' || this.form.kl === '';
    },

  },
});

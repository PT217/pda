import {
  removeAllStorage,
  toLogin,
} from '@/utils/auth';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: (): any => {
    return {
      userInfo: {},
      order: [],
    };
  },
  actions: {
    logout() {
      removeAllStorage();
      toLogin();
    },
  },
});

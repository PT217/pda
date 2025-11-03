<template>
  <view class="login">
    <view class="login-welcome">
      <image :src="logoBg" mode="scaleToFill"></image>
      <view class="label">容器管理系统</view>
    </view>

    <view class="login-form" ref="formRef">
      <view class="title">
        <image :src="yh" mode="scaleToFill" />
        <text>用户名</text>
      </view>
      <up-input
        type="text"
        class="login-form-input"
        v-model="store.form.dlbm"
        placeholder="请输入用户名"
        @focus="hd"
        @blur="sq"
      ></up-input>

      <view class="title">
        <image :src="mm" mode="scaleToFill" />
        <text>密码</text>
      </view>
      <up-input
        type="password"
        class="login-form-input"
        v-model="store.form.kl"
        placeholder="请输入密码"
        @focus="hd"
        @blur="sq"
      ></up-input>
    </view>

    <view class="btn">
      <up-button
        shape="circle"
        type="primary"
        :disabled="store.loginFormState()"
        @click="submit"
      >
        登录
      </up-button>
    </view>
  </view>
</template>
<script setup lang="ts">
import logoBg from "@/static/logo.png";
import yh from "@/static/yh.png";
import mm from "@/static/mm.png";
import { useIndexStore } from "@/store/modules/indexStore";
import { ref, nextTick } from "vue";
const store = useIndexStore();
const { loginFormState, handleLogin } = store;

const submit = () => {
  if (loginFormState()) {
    uni.showToast({
      title: "请输入用户名或密码",
      icon: "none",
    });
    return;
  }
  handleLogin();
};

const formRef = ref();
const hd = () => (formRef.value.$el.style.top = "30%");
const sq = () => (formRef.value.$el.style.top = "");
</script>
<style lang="scss" scoped>
.login {
  width: 750rpx;
  box-sizing: border-box;
  position: relative;
  padding: 0 49rpx;
  overflow: auto;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("@/static/login-bg.png");
  height: 100vh;

  .login-welcome {
    padding-top: 37rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    margin-bottom: 612rpx;
    color: #333333;

    image {
      margin-right: 25rpx;
      width: 110rpx;
      height: 45rpx;
      vertical-align: middle;
    }
    .label {
      width: 228rpx;
      height: 45rpx;
      font-size: 36rpx;
      color: #ffffff;
    }
  }
  .login-form {
    background-color: transparent;
    position: fixed;
    top: 50%;
    .title {
      width: 600rpx;
      height: 32rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      color: #1a1a1a;
      image {
        width: 35rpx;
        height: 37rpx;
        margin-right: 13rpx;
      }
    }
    :deep(.u-input) {
      margin: 25rpx 0;
      width: 600rpx;
      height: 76rpx;
      background-color: #ffffff;
      border-radius: 12rpx;
    }
  }
  .btn {
    position: fixed;
    top: 85%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 600rpx;
    height: 120rpx;
  }
}
</style>

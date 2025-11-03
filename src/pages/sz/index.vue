<script lang="ts" setup>
import dcBg from "@/static/dc.png";
import drBg from "@/static/dr.png";
import { onShow, onNavigationBarButtonTap } from "@dcloudio/uni-app";
import { removeAllStorage, toLogin } from "@/utils/auth";
import tc from "@/static/tc.png";
// import MumuOneCode from "@/uni_modules/mumu-oneCode/components/mumu-oneCode/mumu-oneCode.vue";

// onShow(() => {
//   onNavigationBarButtonTap((e) => {
//     console.log(e);

//     removeAllStorage();
//     toLogin();
//   });
// });

// 退出系统
const quit = () => {
  removeAllStorage();
  toLogin();
};

// 数据导出
const dc = () => {
  uni.navigateTo({
    url: "/pages/dclb/index",
  });
};
// 数据导入
const dr = () => {
  uni.navigateTo({
    url: "/pages/drlb/index",
  });
};

// const handlerSuccess = (code: any) => {
//   uni
//     .showModal({
//       content: code,
//     })
//     .then((res) => {
//       console.log(res);

//       uni.navigateBack();
//     });
// };
</script>

<!-- 设置界面 -->
<template>
  <view class="sz">
    <view class="dc" @click="dc">
      <text>数据导出</text>
      <image :src="dcBg" mode="scaleToFill" />
    </view>
    <view class="dr" @click="dr">
      <text> 数据导入</text>
      <image :src="drBg" mode="scaleToFill" />
    </view>
  </view>

  <!-- <mumu-one-code
    @success="handlerSuccess"
    definition
    :readers="['code_128_reader']"
  ></mumu-one-code> -->
  <image class="tc" :src="tc" @click="quit" mode="scaleToFill" />
</template>

<style lang="scss" scoped>
.sz {
  width: 100vw;
  box-sizing: border-box;
  padding: 74rpx 30rpx;
  background-color: #f3f3f3;
  height: calc(100vh - 200rpx);
  view {
    box-sizing: border-box;
    width: 690rpx;
    height: 200rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
    border-radius: 6rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 60rpx;
    padding-right: 40rpx;
    margin-bottom: 30rpx;
    image {
      width: 127rpx;
      height: 109rpx;
    }
  }
}
.tc {
  position: fixed;
  top: 36rpx;
  z-index: 999;
  right: 30rpx;
  color: #ffffff;
  width: 32rpx;
  height: 32rpx;
}
</style>

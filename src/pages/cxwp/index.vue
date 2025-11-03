<!-- 查询物品 -->
<template>
  <view class="top">
    <up-icon
      name="scan"
      size="26"
      style="margin-right: 10rpx"
      @click="ewmFn"
    ></up-icon>
    <up-search
      v-model="keyword"
      animation
      show-action
      placeholder="输入外观喷号或铭牌编号"
      @custom="searchFn"
      @search="searchFn"
      :searchIconSize="14"
    ></up-search>
  </view>

  <view class="form">
    <WpDetails v-if="form" :form="form" />
  </view>

  <up-toast ref="uToastRef"></up-toast>
  <view class="jzShow">
    <up-loading-icon :show="show" text="加载中" textSize="12"></up-loading-icon>
  </view>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import WpDetails from "@/components/WpDetails/index.vue";
import { getWpxx, doScan } from "@/api/ck";
import { onShow, onHide } from "@dcloudio/uni-app";

onShow(() => {
  window.addEventListener("test-event", (e: any) => (keyword.value = e.detail));
});

onHide(() => {
  window.removeEventListener(
    "test-event",
    (e: any) => (keyword.value = e.detail)
  );
});

const keyword = ref<string>("");

const form = ref(null);
const show = ref(false);

const searchFn = async () => {
  show.value = true;
  const res: any = await getWpxx({ wpbh: keyword.value });
  if (res.data) {
    form.value = {
      ...res.data,
    };
    show.value = false;
  } else {
    uni.showToast({
      title: "没有查询到此编号物品",
      icon: "none",
    });
    form.value = null;
    show.value = false;
  }
};

// 获取扫描数据
const ewmFn = async () => {
  const res: any = await doScan();
  keyword.value = res.data ? res.data : "";
};
</script>

<style lang="scss" scoped>
.form {
  width: 750rpx;
  box-sizing: border-box;
  padding: 20rpx;
  height: 100vh;
  overflow: auto;
  background-color: #fff;
}
.top {
  width: 750rpx;
  height: 150rpx;
  max-height: 200rpx;
  background-color: #fff;
  border-top: 1px solid gray;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx;
  box-sizing: border-box;
}
.jzShow {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

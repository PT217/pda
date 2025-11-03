<!-- 添加物品 -->
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

import { onShow, onHide, onNavigationBarButtonTap } from "@dcloudio/uni-app";
import { getWpxx, getRcWpxx, doScan } from "@/api/ck";
import { saveCrcjlmx } from "@/api/index";
import { saveKjtzjlmx } from "@/api/kjtz";

onNavigationBarButtonTap((e) => {
  if (form.value) {
    addFn();
  }
});
onShow(() => {
  window.addEventListener("test-event", (e: any) => (keyword.value = e.detail));
});

onHide(() => {
  window.removeEventListener(
    "test-event",
    (e: any) => (keyword.value = e.detail)
  );
});

const pages = getCurrentPages();
const page: any = pages[pages.length - 1];
const tbjlbh = page?.options?.query;
const rcbs = page?.options?.rcbs; //入场标识
const kjtz = page?.options?.kjtz; //入场标识

const keyword = ref<string>("");
const form = ref(null);
const show = ref(false);
const uToastRef = ref();

// 输入编号查询
const searchFn = async () => {
  show.value = true;
  console.log(rcbs);
  let res: any;
  // 如果是入场则查询所有的物品
  if (rcbs) {
    res = await getRcWpxx({ wpbh: keyword.value });
  } else {
    res = await getWpxx({ wpbh: keyword.value });
  }
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

// 添加此物品
const addFn = async () => {
  let res: any;
  if (kjtz) {
    res = await saveKjtzjlmx({
      ...(form.value as any),
      tbjlbh: tbjlbh,
    });
  } else {
    res = await saveCrcjlmx({
      ...(form.value as any),
      tbjlbh: tbjlbh,
    });
  }
  if (res.code === 0) {
    uToastRef.value.show({
      type: "success",
      title: "默认主题",
      message: "添加成功",
    });
  } else {
    uToastRef.value.show({
      type: "error",
      title: "失败主题",
      message: res.message,
    });
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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

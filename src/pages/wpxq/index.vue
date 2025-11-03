<script lang="ts" setup>
import WpDetails from "@/components/WpDetails/index.vue";
import { ref } from "vue";
import { onShow, onUnload } from "@dcloudio/uni-app";
import { getWpxx, getRcWpxx } from "@/api/ck";

const form = ref(null);
onShow(() => {
  requestFn();
});

const pages = getCurrentPages();
const page: any = pages[pages.length - 1];
const wpbh = page?.options?.query;
const rcbs = page?.options?.rcbs; //入场标识
const sfmxcx = page?.options?.sfmxcx; //明细标识

const requestFn = async () => {
  let res: any;
  // 如果是入场则查询所有的物品
  if (rcbs) {
    res = await getRcWpxx({ wpbh, sfmxcx });
  } else {
    res = await getWpxx({ wpbh, sfmxcx });
  }
  form.value = res.data;
};
</script>
<template>
  <view class="xq">
    <WpDetails v-if="form" :form="form" />
  </view>
</template>
<style lang="scss" scoped>
.xq {
  // height: 100vh;
  width: 750rpx;
  background-color: #f3f3f3;
  padding: 30rpx;
  box-sizing: border-box;
}
</style>

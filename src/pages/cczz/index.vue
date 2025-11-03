<template>
  <view class="cczz">
    <view class="cm" v-for="(item, index) in xzcczzList" @click="rcmxFn(item)">
      <text>{{ item.zzmc }}</text>
      <image :src="qjBg" mode="scaleToFill" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import xzdjBg from "@/static/xzdj.png";
import qjBg from "@/static/qj.png";
import { queryZzdy } from "@/api/index";
import { saveRrcjl } from "@/api/rcdj";

// 选择出厂机构
const xzcczzList = ref<any>([]);

onShow(() => {
  requestFn();
});

// 查询所有机构
const requestFn = async () => {
  const res: any = await queryZzdy({});
  xzcczzList.value = res.data;
};

// 跳转至入厂明细页面

const rcmxFn = async (item: any) => {
  // 获取入厂登记的编号
  const res: any = await saveRrcjl({
    jllxdm: "10001",
    jllxmc: "入厂",
    cczzbm: item.zzbm,
    cczzmc: item.zzmc,
  });
  if (res.code === 0) {
    uni.navigateTo({
      url: `/pages/rcmx/index?query=${res.data}`,
    });
  } else {
    uni.showToast({
      title: res.message,
      icon: "none",
    });
  }
};
</script>

<style lang="scss" scoped>
.cczz {
  width: 100vw;
  padding: 30rpx;
  box-sizing: border-box;
  background-color: #f3f3f3;
  height: calc(100vh - 100rpx);
  overflow: auto;
  .cm {
    width: 690rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
    border-radius: 6rpx;
    margin-bottom: 21rpx;
    image {
      width: 16rpx;
      height: 28rpx;
    }
  }
}
</style>

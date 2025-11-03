<script setup lang="ts">
import { ref, reactive } from "vue";
import { onShow } from "@dcloudio/uni-app";
import xzdjBg from "@/static/xzdj.png";
import ydcBg from "@/static/ydc.png";
import { queryRcjl } from "@/api/rcdj";
import { deleteCrcjl } from "@/api/index";

const options = reactive([
  {
    text: "删除",
    style: {
      color: "#ff1616",
    },
  },
]);

onShow(() => {
  requestFn();
});

const rcdjList = ref<any>([]);
//获取入厂登记列表
const requestFn = async () => {
  const res: any = await queryRcjl({});
  rcdjList.value = res.data;
};

// 选择出厂机构
const add = () => {
  uni.navigateTo({
    url: "/pages/cczz/index",
  });
};

// 入厂明细
const rcmx = (item: any) => {
  uni.navigateTo({
    url: `/pages/rcmx/index?query=${item.tbjlbh}`,
  });
};

const uToastRef = ref();

const scArr = ref<string[]>([]);
// 删除登记的明细
const scFn = (arr: string[]) => {
  scArr.value = arr;
  showFn();
};

const show = ref(false);
const showFn = () => (show.value = !show.value);

const sumbit = async () => {
  const res: any = await deleteCrcjl({ tbjlbhList: scArr.value });
  if (res.code === 0) {
    uToastRef.value.show({
      type: "success",
      title: "默认主题",
      message: res.message,
    });
    showFn();
    requestFn();
  }
};
const cancel = () => {
  showFn();
};
</script>

<template>
  <view class="rcdj">
    <up-swipe-action>
      <up-swipe-action-item
        :options="options"
        v-for="item in rcdjList"
        :key="item.tbjlbh"
        @click="scFn([item.tbjlbh])"
      >
        <view class="box" @click="rcmx(item)">
          <view class="left">
            <view class="top">
              <view class="title">出厂机构:{{ item.cczzmc }}公司</view>
              <view>数量:{{ item.sl ? item.sl : 0 }}</view>
            </view>

            <view class="bottom">
              <view class="sj">创建时间:{{ item.cjsj }}</view>
              <view class="sj dcsj" v-if="item.dcsj"
                >导出时间:{{ item.dcsj }}</view
              >
            </view>
          </view>
          <image v-if="item.dcsj" class="ydc" :src="ydcBg" mode="scaleToFill" />
        </view>
      </up-swipe-action-item>
    </up-swipe-action>

    <view class="btn" @click="add">
      <image :src="xzdjBg" mode="scaleToFill" />
      <view class="add">新增登记</view>
    </view>
  </view>
  <up-modal
    :show="show"
    @confirm="sumbit"
    @cancel="cancel"
    ref="uModal"
    :asyncClose="true"
    showCancelButton
  >
    <view>您确定要删除吗?</view>
  </up-modal>

  <up-toast ref="uToastRef"></up-toast>
</template>

<style lang="scss" scoped>
.rcdj {
  width: 750rpx;
  box-sizing: border-box;
  height: calc(100vh - 200rpx);
  padding: 30rpx;
  background-color: #f3f3f3;
  overflow: auto;
  .box {
    width: 690rpx;
    padding: 30rpx;
    box-sizing: border-box;
    position: relative;
    .left {
      .top {
        display: flex;
        align-items: center;
        view {
          width: 50%;
          font-size: 30rpx;
          color: #333333;
        }
        .title {
          width: 70%;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        margin-top: 22rpx;
        .sj {
          width: 50%;
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: #666666;
        }
      }
    }
    .ydc {
      position: absolute;
      right: 30rpx;
      top: 10rpx;
      width: 80rpx;
      height: 54rpx;
    }
  }
  .btn {
    width: 127rpx;
    height: 127rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
    border-radius: 50%;
    position: fixed;
    right: 38rpx;
    bottom: 17%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    image {
      width: 26rpx;
      height: 26rpx;
    }
    .add {
      font-size: 20rpx;
      color: #888888;
      margin-top: 14rpx;
    }
  }
  :deep(.u-swipe-action-item) {
    margin-bottom: 30rpx;
  }
  :deep(.u-swipe-action-item__right__button__wrapper) {
    background-color: #fff !important;
  }
  .u-border-bottom {
    border-bottom-style: none;
  }
}
</style>

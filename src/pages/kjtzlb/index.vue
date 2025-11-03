<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { onShow } from "@dcloudio/uni-app";
import xzdjBg from "@/static/xzdj.png";
import ydcBg from "@/static/ydc.png";
import { queryKjtzjl, deleteKjtzjl } from "@/api/kjtz";

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

const kjtzList = ref<any>([]);

//获取出厂登记列表
const requestFn = async () => {
  const res: any = await queryKjtzjl({});
  kjtzList.value = res.data;
};
// 选择库间调整仓库
const add = () => {
  uni.navigateTo({
    url: "/pages/xzzrckwz/index",
  });
};
// 出厂明细
const kjtzmx = (item: any) => {
  uni.navigateTo({
    url: `/pages/kjtzmx/index?query=${item.tbjlbh}`,
  });
};

const uToastRef = ref();

const scFn = async (bh: string) => {
  const res: any = await deleteKjtzjl({ tbjlbh: bh });
  if (res.code === 0) {
    uToastRef.value.show({
      type: "success",
      title: "默认主题",
      message: "删除成功",
    });
    requestFn();
  } else {
    uToastRef.value.show({
      type: "error",
      title: "失败主题",
      message: res.message,
    });
  }
};
</script>

<template>
  <view class="kjtzlb">
    <up-swipe-action>
      <up-swipe-action-item
        :options="options"
        v-for="item in kjtzList"
        :key="item.tbjlbh"
        @click="scFn(item.tbjlbh)"
      >
        <view class="box" @click="kjtzmx(item)">
          <view class="left">
            <view class="top">
              <view class="title"
                >转入仓库:{{ item.zrckmc }}-{{ item.zrkqmc }}
              </view>
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
      <view class="add">新增记录</view>
    </view>
  </view>

  <up-toast ref="uToastRef"></up-toast>
</template>

<style lang="scss" scoped>
.kjtzlb {
  width: 750rpx;
  box-sizing: border-box;
  height: calc(100vh - 100rpx);
  padding: 30rpx;
  background-color: #f3f3f3;
  // background-color: red;
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

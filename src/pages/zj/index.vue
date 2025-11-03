<script setup lang="ts">
import { ref, reactive } from "vue";
import { onShow } from "@dcloudio/uni-app";
import ydcBg from "@/static/ydc.png";
import { queryJcrwData } from "@/api/zj";

onShow(() => {
  current.value = 0;
  // 默认查询 (1:例检 2:定检)
  requestFn(1);
});

const zjrwList = ref<any>([]);
const requestFn = async (lx: any) => {
  const res: any = await queryJcrwData({ rwlx: lx });
  zjrwList.value = res.data;
};

const current = ref<number>(0);
const list = reactive<any[]>([{ name: "例检任务" }, { name: "定检任务" }]);
const tabsClick = (item: any) => {
  if (current.value === item.index) return;
  zjrwList.value = [];
  requestFn(item.index + 1);
  current.value = item.index;
};

// 任务点击查看明细
const rwFn = (item: any) => {
  uni.navigateTo({
    url: `/pages/jcqd/index?query=${item.jcrwbh}`,
  });
};
</script>

<template>
  <up-sticky bgColor="#fff">
    <up-tabs :list="list" @click="tabsClick" :current="current"></up-tabs>
  </up-sticky>
  <view class="zj">
    <view class="box" v-for="item in zjrwList" @click="rwFn(item)">
      <view class="left">
        <view class="top">
          <view class="top-left">
            <text>{{ item.jclxmc }}</text>
            <text class="zjbh">{{ item.zjbh }}</text>
          </view>
          <view class="top-right" v-if="current === 1">
            检查月份:{{ item.jcyf ? item.jcyf : "无" }}
          </view>
          <view v-else></view>
        </view>

        <view class="bottom">
          <view class="sj">
            <text style="margin-right: 20rpx">
              检查数量:{{ item.jcsl ? item.jcsl : 0 }}
            </text>
            <text>{{ item.jcztmc }}</text>
          </view>
          <view class="sj dcsj" v-if="item.dcsj">导出时间:{{ item.dcsj }}</view>
        </view>
      </view>
      <image v-if="item.dcsj" class="ydc" :src="ydcBg" mode="scaleToFill" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.u-sticky {
  // top: 0 !important;
  :deep(.uni-scroll-view-content) {
    width: 50% !important;
    margin: 0 auto;
    padding-left: 32rpx;
  }
}
.zj {
  width: 750rpx;
  box-sizing: border-box;
  height: calc(100vh - 290rpx);
  padding: 30rpx;
  background-color: #f3f3f3;
  overflow: auto;

  .box {
    padding: 30rpx;
    position: relative;
    margin-bottom: 30rpx;
    background-color: #fff;
    display: flex;
    .left {
      width: 95%;
      .top {
        display: flex;
        align-items: center;
        view {
          width: 50%;
          font-size: 22rpx;
          color: #333333;
          word-wrap: break-word; /* 支持长单词换行 */
          overflow-wrap: break-word; /* 处理长单词换行的现代属性 */
          white-space: normal; /* 默认换行行为 */
          word-break: break-all;
          .zjbh {
            font-size: 18rpx;
            margin-left: 30rpx;
          }
        }
        .top-left {
          width: 70%;
        }

        .top-right {
          text-align: right;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        margin-top: 22rpx;
        .sj {
          display: flex;
          align-items: center;
          font-size: 26rpx;
          color: #666666;
          word-wrap: break-word; /* 支持长单词换行 */
          overflow-wrap: break-word; /* 处理长单词换行的现代属性 */
          white-space: normal; /* 默认换行行为 */
          word-break: break-all;
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
  .box:last-child {
    margin-bottom: 0;
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

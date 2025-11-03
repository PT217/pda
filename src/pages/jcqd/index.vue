<script lang="ts" setup>
import { ref, computed } from "vue";
import { onShow, onNavigationBarButtonTap } from "@dcloudio/uni-app";
import { queryJcrwqdData } from "@/api/zj";

const pages = getCurrentPages();
const page: any = pages[pages.length - 1];
const jcrwbh = page?.options?.query;

const jcyf = ref<string>(""); //检查月份
const jcsl = ref<string>(""); //检查数量
const zjbh = ref<string>(""); //质检编号
const jclxmc = ref<string>(""); //检查类型名称
const wpqdList = ref<any>([]);

onShow(() => {
  requestFn();
});

// 查询检查清单
const requestFn = async () => {
  const res: any = await queryJcrwqdData({ jcrwbh });
  jcyf.value = res.data.jcyf;
  jcsl.value = res.data.jcsl;
  zjbh.value = res.data.zjbh;
  jclxmc.value = res.data.jclxmc;
  wpqdList.value = res.data.wpqdList.map((item: any) => ({
    ...item,
    checked: false,
  }));
};

// 检查登记详情
const jcdjFn = (item: any) => {
  let obj = {
    jcrwbh,
    wpqdbh: item.wpqdbh,
    ggxhdm: item.ggxhdm,
    jclxdm: item.jclxdm,
    jcqkmc: item.jcqkmc,
    jcqkdm: item.jcqkdm,
    jcjlmc: item.jcjlmc,
    wpqdbhList: [item.wpqdbh],
  };
  uni.navigateTo({
    url: `/pages/jcdj/index?data=${JSON.stringify(obj)}`,
  });
};

const checkedFn = (item: any) => {
  item.checked = !item.checked;
};

const plbjzt = computed(() => {
  // 获取当前选中的所有物品
  let tempWpqdList = wpqdList.value.filter((item: any) => item.checked);

  // 如果未选择物品则禁用该按钮
  if (!tempWpqdList.length) return true;

  // 取出数组第一个元素的规格型号代码
  let tempGgxhdm = tempWpqdList[0].ggxhdm;

  // 遍历该数组是否存在规格型号不一致的物品
  return tempWpqdList.find((item: any) => item.ggxhdm !== tempGgxhdm);
});

const plbjFn = () => {
  console.log("进入");
  // 获取到可以批量编辑的物品清单编号集合
  let wpList: any = wpqdList.value.filter((item: any) => item.checked);
  let wpqdbhList: any = wpList.map((item: any) => item.wpqdbh);
  let obj = {
    jcqkdm: wpList[0].jcqkdm, //保存入参
    jcqkmc: wpList[0].jcqkmc, //保存入参
    jcrwbh, //保存入参
    wpqdbh: wpList[0].wpqdbh, //查询数据
    ggxhdm: wpList[0].ggxhdm, //查询数据
    jclxdm: wpList[0].jclxdm, //查询数据

    jcjlmc: "", //保存入参
    wpqdbhList,
  };
  uni.navigateTo({
    url: `/pages/jcdj/index?data=${JSON.stringify(obj)}`,
  });
};

enum Zt {
  待检查 = "primary",
  检查中 = "warning",
  检查完成 = "success",
}
</script>

<template>
  <view class="jcqd" v-if="wpqdList.length">
    <view class="head">
      <view>
        <text style="font-weight: 700; margin-right: 20rpx">{{ jclxmc }}</text>
        <text>{{ zjbh }}</text>
      </view>
      <view>
        <text>检查月份:{{ jcyf ? jcyf : "无" }}</text>
      </view>
    </view>

    <view class="content">
      <up-text :text="`检查数量:${wpqdList.length}`"></up-text>

      <view
        class="box"
        v-for="(item, index) in wpqdList"
        :key="index"
        @click="jcdjFn(item)"
      >
        <up-checkbox
          usedAlone
          @change="checkedFn(item)"
          :checked="item.checked"
        ></up-checkbox>

        <view class="left">
          <view>{{ item.mpbh }}</view>
          <view>{{ item.wgph ? item.wgph : "无" }}</view>
          <view>{{ item.ggxhdm }}</view>
        </view>

        <up-tag
          size="mini"
          :text="item.jcqkmc ? item.jcqkmc : '无'"
          :type="item.jcqkmc?Zt[item.jcqkmc as keyof typeof Zt]:'info'"
        ></up-tag>
      </view>
    </view>
  </view>
  <up-button
    class="tc"
    text="编辑"
    :disabled="plbjzt"
    @click="plbjFn"
    type="primary"
  ></up-button>
</template>
<style lang="scss" scoped>
.jcqd {
  width: 750rpx;
  box-sizing: border-box;
  height: calc(100vh - 100rpx);
  background-color: #f3f3f3;
  overflow: auto;

  .head {
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
    border-radius: 6rpx;
    padding: 23rpx 50rpx;

    view {
      display: flex;
      align-items: center;
      text {
        font-size: 26rpx;
      }
    }
    image {
      width: 30rpx;
      height: 30rpx;
      margin-right: 10rpx;
    }
    text {
      font-size: 30rpx;
      color: #777777;
    }
  }

  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
    border-radius: 6rpx;
    margin: 15rpx 10rpx;
    padding: 30rpx;

    .left {
      width: 60%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      view {
        max-width: 200rpx;
        font-size: 26rpx;
        color: #777777;
        word-wrap: break-word;
        /* 支持长单词换行 */
        overflow-wrap: break-word;
        /* 处理长单词换行的现代属性 */
        white-space: normal;
        /* 默认换行行为 */
        word-break: break-all;
      }
    }
  }

  .content {
    padding: 30rpx;
    :deep(.u-text) {
      margin-bottom: 11rpx !important;
    }
  }
}
.tc {
  position: fixed;
  top: 36rpx;
  z-index: 999;
  right: 30rpx;
  // color: #ffffff;
  width: 80rpx;
  height: 40rpx;
}
</style>

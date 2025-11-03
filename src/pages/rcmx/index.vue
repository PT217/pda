<script lang="ts" setup>
import { ref, reactive } from "vue";
import addBg from "@/static/add.png";
import cczBg from "@/static/ccz.png";
import cjsjBg from "@/static/cjsj.png";
import { onShow, onNavigationBarButtonTap } from "@dcloudio/uni-app";
import { getRcjl } from "@/api/rcdj";
import { deleteCrcjlmx } from "@/api/index";

onNavigationBarButtonTap((e) => {
  if (wpmxList.value.length) showCheckBox.value = !showCheckBox.value;
});

const options = reactive([
  {
    text: "删除",
    style: {
      color: "#ff1616",
    },
  },
]);

const pages = getCurrentPages();
const page: any = pages[pages.length - 1];
const tbjlbh = page?.options?.query;

const cjsj = ref<string>("");
const cczzmc = ref<string>("");
const wpmxList = ref<any>([]);

onShow(() => {
  requestFn();
});

// 查询入厂记录详情
const requestFn = async () => {
  const res: any = await getRcjl({ tbjlbh });
  cjsj.value = res.data.cjsj;
  cczzmc.value = res.data.cczzmc;
  wpmxList.value = res.data.wpmxList.map((item: any) => ({
    ...item,
    checked: false,
  }));
};

const showCheckBox = ref(false);

const add = () => {
  uni.navigateTo({
    url: `/pages/tjwp/index?query=${tbjlbh}&rcbs=${true}`,
  });
};

// 删除物品明细的数组
const scArr = ref<string[]>([]);

const uToastRef = ref();
// 删除
const sc = (arr?: string[]) => {
  scArr.value = arr
    ? arr
    : wpmxList.value
        .filter((item: any) => item.checked)
        .map((item: any) => item.mxbh);
  if (scArr.value.length) {
    showFn();
  } else {
    uToastRef.value.show({
      type: "error",
      title: "失败主题",
      message: "至少选择一条数据",
    });
  }
};

const show = ref(false);
const showFn = () => (show.value = !show.value);

const sumbit = async () => {
  const res: any = await deleteCrcjlmx({
    mxbhList: scArr.value,
    tbjlbh,
  });
  if (res.code === 0) {
    uToastRef.value.show({
      type: "success",
      title: "默认主题",
      message: res.message,
    });
    requestFn();
  } else {
    uToastRef.value.show({
      type: "error",
      title: "失败主题",
      message: res.message,
    });
  }
  showFn();
};
const cancel = () => {
  showFn();
};
const checkedFn = (item: any) => {
  item.checked = !item.checked;
};
// 全选
const qx = () => {
  wpmxList.value = wpmxList.value.map((item: any) => ({
    ...item,
    checked: true,
  }));
};
// 详情
const xq = (item: any) => {
  uni.navigateTo({
    url: `/pages/wpxq/index?query=${item.wpbh}&rcbs=${true}&sfmxcx=Y`,
  });
};
</script>

<template>
  <view class="ccmx">
    <view class="head">
      <view>
        <image :src="cczBg" mode="scaleToFill" />
        <text>出厂机构:{{ cczzmc }}公司</text>
      </view>
      <view>
        <image :src="cjsjBg" mode="scaleToFill" />
        <text>创建时间:{{ cjsj }}</text>
      </view>
    </view>

    <view class="content">
      <up-text :text="`合计:${wpmxList.length}`"></up-text>

      <up-swipe-action>
        <up-swipe-action-item
          :options="options"
          v-for="(item, index) in wpmxList"
          :key="index"
          @click="sc([item.mxbh])"
        >
          <view class="info" @click="xq(item)">
            <up-checkbox
              @change="checkedFn(item)"
              usedAlone
              v-if="showCheckBox"
              :checked="item.checked"
            ></up-checkbox>
            <view class="infoList">
              <view class="box top">
                <view>物品类型:{{ item.wplxmc }}</view>
                <view>规格型号:{{ item.ggxhmc }}</view>
                <view></view>
              </view>

              <view class="box">
                <view>外观喷号:{{ item.wgph }}</view>
                <view>铭牌编号:{{ item.mpbh }}</view>
                <view>权属机构:{{ item.qszzmc }}</view>
              </view>
            </view>
          </view>
        </up-swipe-action-item>
      </up-swipe-action>
    </view>

    <view class="qx" v-if="showCheckBox" @click="qx">
      <text>全选</text>
    </view>

    <view class="btn">
      <text v-if="showCheckBox" @click="sc()">删除</text>
      <image v-else :src="addBg" mode="scaleToFill" @click="add" />
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
.ccmx {
  width: 750rpx;
  box-sizing: border-box;
  height: calc(100vh - 100rpx);
  background-color: #f3f3f3;

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

  .content {
    padding: 30rpx;
    :deep(.u-text) {
      margin-bottom: 11rpx !important;
    }
    .info {
      padding: 30rpx;
      background-color: #ffffff;
      box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
      border-radius: 6rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .infoList {
        width: 95%;
      }

      .box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        view {
          width: 32%;
          font-size: 26rpx;
          color: #777777;
          word-wrap: break-word; /* 支持长单词换行 */
          overflow-wrap: break-word; /* 处理长单词换行的现代属性 */
          white-space: normal; /* 默认换行行为 */
          word-break: break-all;
        }
      }
      .top {
        view {
          font-size: 30rpx;
          color: #333333;
          margin-bottom: 30rpx;
        }
      }
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
    bottom: 127rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    image {
      width: 30rpx;
      height: 30rpx;
    }
  }
  .qx {
    width: 108rpx;
    height: 108rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
    border-radius: 50%;
    position: fixed;
    left: 38rpx;
    bottom: 127rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
:deep(.u-swipe-action-item) {
  margin-bottom: 30rpx;
}
:deep(.u-swipe-action-item__right__button__wrapper) {
  background-color: #fff !important;
}
</style>

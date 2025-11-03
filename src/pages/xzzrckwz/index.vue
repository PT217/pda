<script lang="ts" setup>
import { ref } from "vue";
import { onShow, onHide } from "@dcloudio/uni-app";
import { queryCk, queryKq } from "@/api/ck";
import { saveKjtzjl } from "@/api/kjtz";

const ckbm = ref<string>("");
const ckmc = ref<string>("");
const kqbm = ref<string>("");
const kqmc = ref<string>("");

onShow(() => {
  ckbm.value = "";
  ckmc.value = "";
  kqbm.value = "";
  kqmc.value = "";
  ckFn();
});
onHide(() => {
  ckRef.value.close();
});

const ckRef = ref();

const ckOptions = ref<any>([]);
// 查询所有仓库
const ckFn = async () => {
  const res: any = await queryCk({});
  ckOptions.value = res.data.map((item: any) => ({
    label: item.mc,
    value: item.bm,
    selected: false,
  }));
  console.log(res.data);
  kqFn(ckOptions.value[0]);
};

const kqOptions = ref<any>([]);

// 查询所有库区
const kqFn = async (row: any) => {
  kqbm.value = "";
  kqmc.value = "";
  ckbm.value = row.value;
  ckmc.value = row.label;
  ckOptions.value.forEach((item: any) => (item.selected = false));
  row.selected = !row.selected;
  ckRef.value.close();
  const res: any = await queryKq({ ckbm: row.value });
  kqOptions.value = res.data?.map((item: any) => ({
    label: item.mc,
    value: item.bm,
    selected: false,
  }));
};

// 库区点击事件
const kqdjFn = (row: any) => {
  kqbm.value = row.value;
  kqmc.value = row.label;
  kqOptions.value.forEach((item: any) => (item.selected = false));
  row.selected = !row.selected;
  ckRef.value.close();
};

// 下一步进入库间明细(准备添加物品)
const uToastRef = ref();
const xybFn = async () => {
  if (!ckbm.value || !kqbm.value) {
    uToastRef.value.show({
      type: "error",
      title: "失败主题",
      message: "请先选择仓库及库区",
    });
    return;
  }
  const res: any = await saveKjtzjl({
    zrckbm: ckbm.value,
    zrckmc: ckmc.value,
    zrkqbm: kqbm.value,
    zrkqmc: kqmc.value,
  });
  if (res) {
    uni.navigateTo({
      url: `/pages/kjtzmx/index?query=${res.data.tbjlbh}`,
    });
  } else {
    uToastRef.value.show({
      type: "error",
      title: "失败主题",
      message: res.data.message,
    });
  }
};
</script>
<template>
  <view class="xzzr">
    <view>
      <u-dropdown ref="ckRef">
        <u-dropdown-item title="库区">
          <view class="slot-content" style="background-color: #ffffff">
            <scroll-view :scroll-y="true" style="max-height: 500rpx">
              <view
                :class="item.selected ? 'active' : 'item'"
                v-for="item in kqOptions"
                @click="kqdjFn(item)"
              >
                {{ item.label }}
              </view>
            </scroll-view>
          </view>
        </u-dropdown-item>

        <u-dropdown-item title="仓库">
          <view class="slot-content" style="background-color: #ffffff">
            <scroll-view :scroll-y="true" style="max-height: 500rpx">
              <view
                :class="item.selected ? 'active' : 'item'"
                v-for="item in ckOptions"
                @click="kqFn(item)"
              >
                {{ item.label }}
              </view>
            </scroll-view>
          </view>
        </u-dropdown-item>
      </u-dropdown>
    </view>

    <view class="info">
      <view>
        选择转入的仓库:
        <up-tag v-if="ckmc" :text="ckmc"></up-tag>
      </view>
      <view>
        选择转入的库区:
        <up-tag v-if="kqmc" :text="kqmc"></up-tag>
      </view>
    </view>
  </view>

  <view class="xyb" @click="xybFn">下一步</view>
  <up-toast ref="uToastRef"></up-toast>
</template>
<style lang="scss" scoped>
.xzzr {
  height: calc(100vh - 100rpx);
  background-color: #fff;
}
.slot-content {
  uni-scroll-view {
    padding: 0;
  }

  .item {
    padding: 22rpx 28rpx;
    font-size: 30rpx;
    color: rgb(96, 98, 102);

    // color: #fff;
    border-top: 1px solid rgb(214, 215, 217);
    background-color: #fff;
  }

  .active {
    padding: 22rpx 28rpx;
    font-size: 30rpx;
    color: #3c9cff;
    border-top: 1px solid rgb(214, 215, 217);
    background-color: #fff;
  }
}

:deep(.u-toast__content__text) {
  word-wrap: break-word; /* 支持长单词换行 */
  overflow-wrap: break-word; /* 处理长单词换行的现代属性 */
  white-space: normal; /* 默认换行行为 */
  word-break: break-all;
}
.info {
  padding: 40rpx;
  view {
    margin: 10rpx;
  }
}
.xyb {
  position: fixed;
  top: 30rpx;
  z-index: 999;
  right: 30rpx;
  color: #ffffff;
  width: 100rpx;
  height: 32rpx;
}
</style>

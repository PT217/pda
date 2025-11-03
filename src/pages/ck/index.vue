<script lang="ts" setup>
import { ref } from "vue";
import { onShow, onHide } from "@dcloudio/uni-app";
import { queryZzdy } from "@/api/index";
import { queryCk, queryKq, queryWpxx, getZtnbqk } from "@/api/ck";
import kjtz from "@/static/kjtz.png";
const request = ref({
  filter: {
    ckbm: "",
    kqbm: "",
    qsjgbm: "",
    nbqkdm: "",
    wpztdm: "",
  },
  orderBy: "",
  pageNum: 1,
  pageSize: 5,
  total: 0,
});

onShow(() => {
  request.value.filter = {
    ckbm: "",
    kqbm: "",
    qsjgbm: "",
    nbqkdm: "",
    wpztdm: "",
  };
  ckFn();
  ztNbqkFn();
  qszzFn();
  requestFn();
});
onHide(() => {
  ckRef.value.close();
});

const wpList = ref<any>([]);

// 获取物品列表
const requestFn = async () => {
  const res: any = await queryWpxx(request.value);
  if (show.value) {
    wpList.value.push(...res.data.list);
  } else {
    wpList.value = res.data.list;
    request.value.total = res.data.total;
  }

  setTimeout(() => {
    ckRef.value.close();
    show.value = false;
    refresherTriggered.value = false;
  }, 1000);
};

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

  kqFn(res.data[0]?.bm);
};

const kqOptions = ref<any>([]);

// 查询所有库区
const kqFn = async (ckbm: string) => {
  request.value.filter.kqbm = "";
  request.value.filter.qsjgbm = "";
  request.value.pageNum = 1;
  const res: any = await queryKq({ ckbm });
  kqOptions.value = res.data?.map((item: any) => ({
    label: item.mc,
    value: item.bm,
    selected: false,
  }));
  requestFn();
};
const qszzOptions = ref<any>([]);

// 查询所有机构
const qszzFn = async () => {
  const res: any = await queryZzdy({});
  qszzOptions.value = res.data.map((item: any) => ({
    label: item.zzmc,
    value: item.zzbm,
    selected: false,
  }));
};

const ckRef = ref();
const ckdjFn = (row: any) => {
  request.value.filter.ckbm = row.value;
  ckOptions.value.forEach((item: any) => (item.selected = false));
  row.selected = !row.selected;
  ckRef.value.close();
  ztNbqkFn();
  kqFn(request.value.filter.ckbm);
};
const kqdjFn = (row: any) => {
  request.value.filter.qsjgbm = "";
  request.value.filter.kqbm = row.value;
  kqOptions.value.forEach((item: any) => (item.selected = false));
  row.selected = !row.selected;
  ckRef.value.close();
  ztNbqkFn();
  requestFn();
};
const qsdjFn = (row: any) => {
  request.value.filter.qsjgbm = row.value;
  qszzOptions.value.forEach((item: any) => (item.selected = false));
  row.selected = !row.selected;
  ckRef.value.close();
  ztNbqkFn();
  requestFn();
};

const ztOptions = ref<any>([]);
const nbqkOptions = ref<any>([]);
const bdhc = ref<any>([]);

// 查询状态和内部情况
const ztNbqkFn = async () => {
  const res: any = await getZtnbqk({
    ckbm: request.value.filter.ckbm,
    kqbm: request.value.filter.kqbm,
    qszzbm: request.value.filter.qsjgbm,
  });

  ztOptions.value = res.data?.ztList?.map((item: any) => ({
    label: item.mc + item.sl,
    value: item.bm,
    selected: false,
  }));
  // 缓存内部编码情况
  bdhc.value = res.data?.nbqkList;
  nbqkOptions.value = res.data?.nbqkList.map((item: any) => ({
    label: item.mc + item.sl,
    value: item.bm,
    selected: false,
  }));
};

// 状态点击
const ztClick = (item: any) => {
  // 清空内部情况的条件
  request.value.filter.nbqkdm = "";
  // 通过状态查询内部情况
  nbqkOptions.value = bdhc.value
    .filter((bdhcItem: any) => bdhcItem.fbm === item.value)
    .map((newItem: any) => ({
      label: newItem.mc + newItem.sl,
      value: newItem.bm,
      selected: false,
    }));

  ztOptions.value.forEach((item: any) => (item.selected = false));
  item.selected = !item.selected;
  ckRef.value.close();

  // ztOptions.value.forEach((element: any) => {
  //   element.checked = element.label === item.label ? true : false;
  // });
  // 状态赋值
  request.value.filter.wpztdm = item.value;
  request.value.pageNum = 1;
  requestFn();
};

// 内部情况点击
const nbqkClick = (item: any) => {
  // nbqkOptions.value.forEach((element: any) => {
  //   element.checked = element.label === item.label ? true : false;
  // });
  nbqkOptions.value.forEach((item: any) => (item.selected = false));
  item.selected = !item.selected;
  ckRef.value.close();
  // 状态赋值
  request.value.filter.nbqkdm = item.value;
  requestFn();
};

// 查询物品
const cxwpFn = () => {
  uni.navigateTo({
    url: "/pages/cxwp/index",
  });
};

// 查询物品详情
const wpxqFn = (item: any) => {
  uni.navigateTo({
    url: `/pages/wpxq/index?query=${item.wpbh}`,
  });
};

const refresherEnabled = ref(true);
const refresherTriggered = ref(false);
const show = ref(false);

/**
 * scroll-view 下拉刷新
 * */
const refresherRefresh = () => {
  wpList.value.length = 0;
  refresherTriggered.value = true;
  request.value.pageNum = 1;
  requestFn();
};
/**
 * scroll-view 上拉加载
 * */
const scrollToLower = () => {
  if (isLastPage()) return;
  show.value = true;
  request.value.pageNum += 1;
  requestFn();
};

// 判断是否是最后一页
const isLastPage = (): Boolean =>
  request.value.total <= request.value.pageNum * request.value.pageSize;

// 重置条件
const reset = () => {
  request.value = {
    filter: {
      ckbm: "",
      kqbm: "",
      qsjgbm: "",
      nbqkdm: "",
      wpztdm: "",
    },
    orderBy: "",
    pageNum: 1,
    pageSize: 5,
    total: 0,
  };
  ckRef.value.close();
  ckFn();
  ztNbqkFn();
  requestFn();
};

const zzShow = ref(false);
const zzShowFn = () => {
  zzShow.value = !zzShow.value;
};
const openFn = () => {
  zzShowFn();
};
const closeFn = () => {
  if (zzShow.value) zzShowFn();
};

const info = uni.getSystemInfoSync();
const kjtzFn = () => {
  uni.navigateTo({
    url: "/pages/kjtzlb/index",
  });
};
</script>

<template>
  <view class="ck">
    <!-- 安卓7 -->
    <u-dropdown
      v-if="info.system === 'Android 7.0'"
      ref="ckRef"
      @open="openFn"
      @close="closeFn"
    >
      <u-dropdown-item title="状态" @change="qsdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in ztOptions"
              @click="ztClick(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>

      <u-dropdown-item title="权属机构" @change="qsdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in qszzOptions"
              @click="qsdjFn(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>

      <u-dropdown-item title="库区" @change="kqdjFn">
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

      <u-dropdown-item title="仓库" @change="ckdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in ckOptions"
              @click="ckdjFn(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>

      <u-dropdown-item title="内部情况" @change="qsdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in nbqkOptions"
              @click="nbqkClick(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>
    </u-dropdown>

    <!-- 安卓10 -->
    <u-dropdown v-else ref="ckRef" @open="openFn" @close="closeFn">
      <u-dropdown-item title="仓库" @change="ckdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in ckOptions"
              @click="ckdjFn(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>

      <u-dropdown-item title="库区" @change="kqdjFn">
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

      <u-dropdown-item title="权属机构" @change="qsdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in qszzOptions"
              @click="qsdjFn(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>

      <u-dropdown-item title="状态" @change="qsdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in ztOptions"
              @click="ztClick(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>

      <u-dropdown-item title="内部情况" @change="qsdjFn">
        <view class="slot-content" style="background-color: #ffffff">
          <scroll-view :scroll-y="true" style="max-height: 500rpx">
            <view
              :class="item.selected ? 'active' : 'item'"
              v-for="item in nbqkOptions"
              @click="nbqkClick(item)"
            >
              {{ item.label }}
            </view>
          </scroll-view>
        </view>
      </u-dropdown-item>
    </u-dropdown>

    <up-overlay :show="zzShow" :z-index="2" :opacity="0.3"></up-overlay>
  </view>

  <scroll-view
    :scroll-y="true"
    :refresher-enabled="refresherEnabled"
    :refresher-triggered="refresherTriggered"
    @refresherrefresh="refresherRefresh"
    @scrolltolower="scrollToLower"
  >
    <view
      class="box"
      v-for="(item, index) in wpList"
      :key="index"
      @click="wpxqFn(item)"
    >
      <view class="info head">
        <view> 物品类型:{{ item.wplxmc }} </view>
        <text>|</text>
        <view> 规格型号:{{ item.ggxhmc }} </view>
        <text>|</text>
        <view> 仓库:{{ item.ckmc }}</view>
      </view>

      <view class="info">
        <view> 外观喷号:{{ item.wgph }}</view>
        <view> 铭牌编号:{{ item.mpbh }}</view>
        <view> 权属机构:{{ item.qsjgmc }}</view>
      </view>

      <view class="info">
        <view> 状态:{{ item.wpztmc }}</view>
        <view> 内部情况:{{ item.nbqkmc }}</view>
        <view> 是否取证:{{ item.sfqz }}</view>
      </view>
    </view>
    <!-- <view class="btn" @click="reset">
      <up-icon size="16" name="reload"></up-icon>
      <view class="add">重置</view>
    </view> -->
    <view class="btn" @click="cxwpFn">
      <up-icon size="16" name="search"></up-icon>
      <view class="add">查询</view>
    </view>
  </scroll-view>

  <view class="jzShow">
    <up-loading-icon :show="show" text="加载中" textSize="12"></up-loading-icon>
  </view>

  <image class="kjtz" :src="kjtz" @click="kjtzFn" mode="scaleToFill" />
</template>

<style lang="scss" scoped>
.ck {
  background-color: #fff;
  width: 750rpx;
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

.tj {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 50rpx;
  margin-bottom: 20rpx;

  :deep(.u-text) {
    display: flex;
    justify-content: flex-start !important;
  }

  .tag {
    width: 77%;
    margin-left: 20rpx;

    :deep(.u-transition) {
      margin-bottom: 20rpx;
    }
  }
}

.nb {
  margin-bottom: 0;
}

scroll-view {
  padding: 30rpx;
  background-color: #f3f3f3;
  width: 750rpx;
  box-sizing: border-box;
  height: calc(100vh - 300rpx);

  .box {
    background-color: #ffffff;
    box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
    border-radius: 6rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30rpx;

      view {
        width: 33%;
        font-size: 20rpx;
        color: #666666;
        word-wrap: break-word;
        /* 支持长单词换行 */
        overflow-wrap: break-word;
        /* 处理长单词换行的现代属性 */
        white-space: normal;
        /* 默认换行行为 */
        word-break: break-all;
      }
    }

    .head {
      view {
        width: 30%;
        font-size: 26rpx;
        color: #333333;
        word-wrap: break-word;
        /* 支持长单词换行 */
        overflow-wrap: break-word;
        /* 处理长单词换行的现代属性 */
        white-space: normal;
        /* 默认换行行为 */
        word-break: break-all;
      }

      text {
        margin-right: 20rpx;
        opacity: 0.3;
      }
    }
  }
}

.btn {
  width: 127rpx;
  height: 127rpx;
  background-color: #fff;
  box-shadow: 0rpx 0rpx 12rpx 0rpx rgba(5, 23, 48, 0.06);
  border-radius: 50%;
  position: fixed;
  right: 38rpx;
  bottom: 17%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .add {
    font-size: 26rpx;
    color: #888888;
    margin-top: 14rpx;
  }
}

:deep(.u-transition) {
  top: 600rpx !important;
}

:deep(.u-button__text) {
  color: #888888;
}

:deep(.u-loading-icon) {
  width: 750rpx;
}

:deep(.u-dropdown__content) {
  max-height: 500rpx !important;
  background-color: #000;
  overflow: auto;
}

:deep(.u-dropdown__content__mask) {
  background-color: #fff;
}
:deep(.u-dropdown),
:deep(.u-dropdown__menu),
:deep(.u-dropdown__menu__item) {
  height: 100rpx;
}
:deep(.u-dropdown__content) {
  top: 100rpx !important;
}

.jzShow {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.kjtz {
  position: fixed;
  top: 36rpx;
  z-index: 999;
  right: 30rpx;
  color: #ffffff;
  width: 32rpx;
  height: 32rpx;
}
</style>

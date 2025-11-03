<script lang="ts" setup>
import { onShow } from "@dcloudio/uni-app";
import { ref, watch } from "vue";
const props = defineProps({
  form: {
    type: Object,
    default: () => ({}),
  },
});

const obj = {
  wplxmc: "物品类型名称",
  ggxhmc: "规格型号",
  // wpbh: "物品编号",
  mpbh: "铭牌编号",
  wgph: "外观喷号",
  wpztmc: "状态",
  nbqkmc: "内部情况",
  pz: "皮重",
  qsjgmc: "权属机构",
  zzcsmc: "制造厂商",
  zzdqmc: "国产/进口",
  zzrq: "制造日期",
  cgrq: "采购日期",
  szjgmc: "当前位置",
  // sfqz: "是否取证",
  ynjrq: "一年检上次日期",
  lnjrq: "两年检上次日期",
  wnzrzrq: "五年再认证日期",
  ckmc: "仓库",
  kqmc: "库区",
  ggxhbm: "规格型号编码",
  qszzbm: "权属机构编码",
  qszzmc: "权属机构名称",
  wplxdm: "物品类型代码",
  fjd: "富集度",

  rqzzbh: "容器制造编号",
  yxtrqbh: "原系统容器编号",
} as any;

const test = ref();

onShow(() => {
  console.log(4);

  // test.value = { ...props.form };
  // delete test.value.wpbh;
});

// 监听搜索数据的变化
watch(
  () => props.form,
  (newValue) => {
    console.log(newValue);

    if (newValue) {
      test.value = { ...props.form };
      delete test.value.wpbh;
      delete test.value.sfqz;
    }
    // value.value = newValue || "";
  },
  {
    immediate: true,
  }
);

function getObjectEntries(obj: any) {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}
</script>
<template>
  <view class="box">
    <view
      v-for="[key, value] in getObjectEntries(test)"
      class="info"
      :key="key"
    >
      <view class="title">{{ obj[key] }}:</view>
      <view class="nr" v-if="key !== 'sfqz'">{{ value }}</view>

      <!-- <view class="nr" v-else>{{ value === "Y" ? "是" : "否" }}</view> -->
      <!-- <view class="nr" v-else>{{ value }}</view> -->
    </view>
  </view>
</template>
<style lang="scss" scoped>
.box {
  width: 690rpx;
  padding: 10rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  // height: calc(100vh - 20rpx);
  // overflow: auto;
  // padding-bottom: 0;
  background-color: #fff;
  .info {
    width: 100%;
    display: flex;
    align-items: center;
    height: 80rpx;
    margin-bottom: 10rpx;
    .title {
      width: 300rpx;
      text-align: right;
      margin-right: 16rpx;
      font-size: 30rpx;
      background-color: #ddd;
      height: 100%;
      line-height: 80rpx;
      padding-right: 30rpx;
    }
    .nr {
      max-width: 300rpx;
      font-size: 28rpx;
      word-wrap: break-word; /* 支持长单词换行 */
      overflow-wrap: break-word; /* 处理长单词换行的现代属性 */
      white-space: normal; /* 默认换行行为 */
      word-break: break-all;
    }
  }
}
</style>

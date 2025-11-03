<script lang="ts" setup>
import { ref, reactive } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { queryJcbxx, plsaveJcbxx } from "@/api/zj";
import moment from "moment";
import TreeUtil from "@/utils/tree";

const pages = getCurrentPages();
const page: any = pages[pages.length - 1];
const data = JSON.parse(page?.options?.data);

const wpqdbh = data.wpqdbh; //物品清单编号
const wpqdbhList = data.wpqdbhList; //物品清单编号
const jcrwbh = data.jcrwbh; //任务编码
const ggxhdm = data.ggxhdm; //规格型号
const jclxdm = data.jclxdm; //规格型号
const jcqkmc = data.jcqkmc; //检查情况名称
const jcqkdm = data.jcqkdm; //检查情况代码
const jcjlmc = ref<any>(data.jcjlmc ? (data.jcjlmc === "合格" ? 1 : 0) : ""); //检查记录名称

onShow(() => {
  requestFn();
});

const tree = ref<any[]>([]);
const nrxtarr = new Map(); //内容相同时input与radio数据合并
// 查询物品清单登记项
const requestFn = async () => {
  const res: any = await queryJcbxx({ wpqdbh, ggxhdm, jclxdm });
  let tempArr = TreeUtil.getTreeData(res.data, "jcbpzbm", "jcbpzfbm");
  nrxtarr.clear();
  // 处理回显的数据
  tree.value = tempArr.map((fl: any) => {
    return {
      flId: fl.jcflbm,
      name: fl.jcflmc,
      subIndex: 0,
      children: fl.children.map((lx: any) => {
        return {
          lxId: lx.jcxmbm,
          name: lx.jcxmmc,
          children: lx.children
            .map((nr: any) => {
              // 以radio为单位寻找要展示的元素
              if (nr.jcqklxdm === "radio") {
                let inputItemArr = lx.children.filter(
                  (lxItem: any) =>
                    lxItem.jcnrbm === nr.jcnrbm && lxItem.jcqklxdm === "input"
                );
                if (inputItemArr.length) nrxtarr.set(nr.jcnrbm, inputItemArr);
                return {
                  jcbpzbm: nr.jcbpzbm,
                  jcnrbm: nr.jcnrbm,
                  jcqklxdm: nr.jcqklxdm, //radio input
                  jcnr: nr.jcnr, //检查内容
                  jcrq: nr.jcrq ? nr.jcrq : new Date(), //检查日期
                  jcrymc: nr.jcrymc, //检查人员
                  jcrybm: nr.jcrybm, //检查人员编码

                  jcxz: nr.jcxz ? (nr.jcxz === "1031000000001" ? 1 : 0) : "", //是否合格
                  dlInput: false,
                  showInput: inputItemArr.length, //当状态为input时
                  input: inputItemArr.length ? nrxtarr.get(nr.jcnrbm) : "",
                };
              } else {
                // 以input为单位寻找独立且不绑定radio的元素
                let radioTemp = lx.children.find(
                  (lxItem: any) =>
                    lxItem.jcnrbm === nr.jcnrbm && lxItem.jcqklxdm === "radio"
                );
                // 如果满足未找到此input对应的值
                if (!radioTemp) {
                  return {
                    jcbpzbm: nr.jcbpzbm,
                    jcqklxdm: nr.jcqklxdm, //radio input
                    jcnr: nr.jcnr, //检查内容
                    jcrq: nr.jcrq ? nr.jcrq : new Date(), //检查日期
                    jcrymc: nr.jcrymc, //检查人员
                    jcrybm: nr.jcrybm, //检查人员编码
                    // jcxz: 0, //是否合格(针对独立input不展示是否合格)
                    showInput: false,
                    dlInput: true,
                    jcxz: nr.jcxz, //当状态为独立input时(组装为数组绑定)
                    jcqkms: nr.jcqkms, //检查情况描述(放前面)
                    jcqkdw: nr.jcqkdw, //检查情况单位(放后面)
                  };
                }
              }
            })
            .filter((xsItem: any) => xsItem),
        };
      }),
    };
  });
};

// 使用索引控制各类的tab
const tabsClick = (e: any, item: any) => {
  item.subIndex = e.index;
};

const hgOptions = [
  {
    label: "合格",
    value: 1,
  },
  {
    label: "不合格",
    value: 0,
  },
];

const uToastRef = ref();
// 保存记录的信息
const saveFn = async () => {
  let xrArr: any = [];
  tree.value.map((lbItem: any) => {
    lbItem.children.map((tabItem: any) => {
      tabItem.children.map((nrItem: any) => xrArr.push(nrItem));
    });
  });
  // 处理非渲染的数组
  let fxrArr = Array.from(nrxtarr.values())
    .flat()
    .map((item: any) => {
      // 此中的input都有其对应内容的单选
      // 寻找每一项修改之后的时间
      let temp = xrArr.find(
        (radioNrItem: any) =>
          radioNrItem.jcnrbm === item.jcnrbm && radioNrItem.jcqklxdm === "radio"
      );
      return {
        jcbpzbm: item.jcbpzbm,
        jcxz: item.jcxz,
        jcrybm: item.jcrybm,
        jcrymc: item.jcrymc,
        jcrq: moment(temp.jcrq).format("YYYY-MM-DD"),
      };
    });

  // 处理渲染的数组
  xrArr = xrArr.map((item: any) => ({
    jcbpzbm: item.jcbpzbm,
    jcxz: item.dlInput
      ? item.jcxz
      : item.jcxz
      ? "1031000000001"
      : "1031000000002",
    jcrybm: item.jcrybm,
    jcrymc: item.jcrymc,
    jcrq: moment(item.jcrq).format("YYYY-MM-DD"),
  }));

  // 合并渲染与不渲染的数组
  const res: any = await plsaveJcbxx({
    wpqdbhList,
    jcrwbh,
    jcjldm: jcjlmc.value ? "1031000000001" : "1031000000002",
    jcjlmc: jcjlmc.value ? "合格" : "不合格",
    jcqkdm,
    jcqkmc,
    jcbList: [...fxrArr, ...xrArr], //所有记录项的合格信息
  });

  if (res.code === 0) {
    uToastRef.value.show({
      type: "success",
      title: "默认主题",
      message: "保存成功",
    });
    setTimeout(() => {
      uni.navigateTo({
        url: `/pages/jcqd/index?query=${jcrwbh}`,
      });
    }, 500);
  } else {
    uni.showToast({
      title: res.message,
      icon: "none",
    });
  }
};
</script>

<template>
  <view class="jcdj">
    <view class="box" v-for="(treeItem, treeIndex) in tree" :key="treeIndex">
      <view class="title">
        <view></view>
        <text>{{ treeItem.name }}</text>
      </view>
      <up-divider></up-divider>
      <up-tabs
        :list="treeItem.children"
        @change="(e:any)=>tabsClick(e,treeItem)"
        :current="treeItem.subIndex"
      ></up-tabs>
      <!-- 开始 -->
      <up-form
        labelPosition="left"
        v-for="nrItem in treeItem.children[treeItem.subIndex].children"
        :key="nrItem.jcbpzbm"
      >
        <up-form-item label="检查内容:" labelWidth="80" borderBottom>
          <text>{{ nrItem.jcnr }}</text>
        </up-form-item>

        <view
          class="nrms"
          v-if="nrItem.showInput"
          v-for="inputItem in nrItem.input"
          :key="inputItem.jcbpzbm"
        >
          <text>{{ inputItem.jcqkms }}</text>
          <up-input v-model="inputItem.jcxz" border="surround"></up-input>
          <text>{{ inputItem.jcqkdw }}</text>
        </view>

        <view class="nrms" v-if="nrItem.dlInput">
          <text>{{ nrItem.jcqkms }}</text>
          <up-input v-model="nrItem.jcxz" border="surround"></up-input>
          <text>{{ nrItem.jcqkdw }}</text>
        </view>

        <up-form-item
          label="检查情况:"
          labelWidth="80"
          borderBottom
          v-if="!nrItem.dlInput"
        >
          <up-radio-group
            v-model="nrItem.jcxz"
            placement="row"
            iconPlacement="left"
          >
            <up-radio
              :customStyle="{ marginBottom: '8px', marginRight: '20rpx' }"
              v-for="(item, index) in hgOptions"
              :key="index"
              :label="item.label"
              :name="item.value"
              shape="square"
            >
            </up-radio>
          </up-radio-group>
        </up-form-item>

        <up-form-item
          v-if="nrItem.jcrymc"
          label="检查人员:"
          labelWidth="80"
          borderBottom
        >
          <text>{{ nrItem.jcrymc }}</text>
        </up-form-item>

        <up-form-item label="检查日期:" labelWidth="80" borderBottom>
          <up-datetime-picker
            hasInput
            v-model="nrItem.jcrq"
            mode="date"
          ></up-datetime-picker>
        </up-form-item>
        <up-divider></up-divider>
      </up-form>

      <!-- 结束 -->
    </view>
    <!-- 最终结论 -->
    <view class="box" v-if="tree.length">
      <view class="title">
        <view></view>
        <text>检查结论</text>
      </view>
      <up-divider></up-divider>
      <up-radio-group v-model="jcjlmc" placement="row" iconPlacement="left">
        <up-radio
          :customStyle="{ marginBottom: '8px', marginRight: '20rpx' }"
          v-for="(item, index) in hgOptions"
          :key="index"
          :label="item.label"
          :name="item.value"
          shape="square"
        >
        </up-radio>
      </up-radio-group>
    </view>
  </view>
  <up-button type="primary" text="保存" @click="saveFn"></up-button>

  <up-toast ref="uToastRef"></up-toast>
</template>
<style lang="scss" scoped>
.jcdj {
  width: 750rpx;
  box-sizing: border-box;
  height: calc(100vh - 190rpx);
  background-color: #f3f3f3;
  overflow: auto;
  .box {
    background-color: #fff;
    border-radius: 20rpx;
    margin: 30rpx;
    padding: 10rpx;
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 40rpx;
      margin-top: 10rpx;
      view {
        background-color: #1e92f0;
        width: 10rpx;
        height: 100%;
        margin: 0 10rpx;
      }
      text {
        color: #000;
        font-size: 30rpx;
      }
    }
  }
}

.nrms {
  padding-left: 160rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
  view {
    margin: 0 10rpx;
  }
  text {
    font-size: 26rpx;
  }
}
.u-button {
  position: fixed;
  bottom: 0;
  border-radius: 0;
}
</style>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { onShow, onNavigationBarButtonTap } from "@dcloudio/uni-app";

import { importData, queryPcdrjl, deletePcdrjl } from "@/api/sz";
onNavigationBarButtonTap((e) => {
  drFn();
});

onShow(() => {
  requestFn();
});

const uToastRef = ref();
const drFn = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.style.display = "none";
  document.body.appendChild(input);
  // input.webkitdirectory = true; // 启用文件夹选择模式
  input.addEventListener("change", async (event: any) => {
    // const files = event.target.files;
    const file = event.target.files[0];
    // 处理选择的文件
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    drShow.value = true;
    // console.log(formData);

    fetch("http://localhost:9999/api/sjgl/importData", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.code === 0) {
          drShow.value = false;
          uToastRef.value.show({
            type: "success",
            title: "默认主题",
            message: data.message,
          });
          requestFn();
        } else {
          uToastRef.value.show({
            type: "error",
            title: "失败主题",
            message: data.message,
          });
        }
      });
    // const res: any = await importData(formData);
    // if (res.code === 0) {
    //   drShow.value = false;
    //   uToastRef.value.show({
    //     type: "success",
    //     title: "默认主题",
    //     message: res.message,
    //   });

    //   requestFn();
    // } else {
    //   uToastRef.value.show({
    //     type: "error",
    //     title: "失败主题",
    //     message: res.message,
    //   });
    // }

    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   console.log(e.target.result);
    // };
    // reader.readAsDataURL(file);
  });
  input.click();
};

const drArr = ref<any>([]);

const requestFn = async () => {
  const res: any = await queryPcdrjl({});
  drArr.value = res.data;
};

const options = reactive([
  {
    text: "删除",
    style: {
      color: "#ff1616",
    },
  },
]);

const scArr = ref<string[]>([]);
// 删除登记的明细
const scFn = (arr: any) => {
  scArr.value = arr;
  showFn();
};

const sumbit = async () => {
  const res: any = await deletePcdrjl({ tbjlbhList: scArr.value });
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

const drShow = ref(false);

const show = ref(false);
const showFn = () => (show.value = !show.value);
</script>
<template>
  <view class="drlb">
    <up-swipe-action>
      <up-swipe-action-item
        v-for="(item, index) in drArr"
        :options="options"
        :key="index"
        @click="scFn([item.id])"
      >
        <view class="box">
          <view>最新数据:{{ item.pcdcsj }}</view>
          <view>导入时间:{{ item.drsj }}</view>
        </view>
      </up-swipe-action-item>
    </up-swipe-action>
  </view>

  <up-modal
    :show="show"
    @confirm="sumbit"
    @cancel="showFn"
    ref="uModal"
    :asyncClose="true"
    showCancelButton
  >
    <view>您确定要删除吗?</view>
  </up-modal>

  <up-toast ref="uToastRef"></up-toast>
  <view class="drShow">
    <up-loading-icon
      :show="drShow"
      text="导入中"
      textSize="12"
    ></up-loading-icon>
  </view>
</template>
<style lang="scss" scoped>
.drlb {
  height: 100vh;
  background-color: #f3f3f3;
  padding: 30rpx;
  box-sizing: border-box;
  width: 750rpx;

  .box {
    width: 690rpx;
    padding: 30rpx;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    view {
      display: flex;
      align-items: center;
      font-size: 30rpx;
      color: #666666;
    }
  }
}

:deep(.u-swipe-action-item) {
  margin-bottom: 30rpx;
}
:deep(.u-swipe-action-item__right__button__wrapper) {
  background-color: #fff !important;
}
.drShow {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

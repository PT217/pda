<script lang="ts" setup>
import { ref } from "vue";
import ydcBg from "@/static/ydc.png";
import { onShow, onNavigationBarButtonTap } from "@dcloudio/uni-app";
import { queryCcjl } from "@/api/ccdj";
import { queryRcjl } from "@/api/rcdj";
import { queryKjtzjl } from "@/api/kjtz";
import { queryJcrwData } from "@/api/zj";
import { exportData } from "@/api/sz";

onNavigationBarButtonTap((e) => {
  dcFn();
});

onShow(() => {
  requestFn();
});
const uToastRef = ref();

const ccList = ref<any>([]);
const rcList = ref<any>([]);
const kjList = ref<any>([]);
const djList = ref<any>([]);
const ljList = ref<any>([]);

const sfscjl = ref<any>(false);
const tsscjlFn = () => {
  sfscjl.value = !sfscjl.value;
};

const requestFn = async () => {
  const res1: any = await queryCcjl({});
  ccList.value = res1.data.map((item: any) => ({ ...item, checked: false }));

  const res2: any = await queryRcjl({});
  rcList.value = res2.data.map((item: any) => ({ ...item, checked: false }));

  const res3: any = await queryKjtzjl({});
  kjList.value = res3.data.map((item: any) => ({ ...item, checked: false }));

  // 定检
  const res4: any = await queryJcrwData({ rwlx: 2 });
  djList.value = res4.data.map((item: any) => ({ ...item, checked: false }));
  // 例检
  const res5: any = await queryJcrwData({ rwlx: 1 });
  ljList.value = res5.data.map((item: any) => ({ ...item, checked: false }));
};

const checkedFn = (item: any) => {
  item.checked = !item.checked;
};

const test = () => {
  let jsonString = JSON.stringify([{ test: "222" }]); //拿到需要导出的数据
  return new Promise((resolve) => {
    //这里封装了个是一个promise异步请求
    // plus.io.requestFileSystem是请求本地文件系统对象
    plus.io.requestFileSystem(
      plus.io.PUBLIC_DOWNLOADS, // 文件系统中的根目录下的DOWNLOADS目录
      (fs: any) => {
        // 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
        fs.root.getFile(
          "文件名" + ".json",
          {
            //这里导出的文件格式可以修改
            create: true, // 文件不存在则创建
          },
          (fileEntry: any) => {
            // 文件在手机中的路径
            console.log(fileEntry.fullPath, "fileEntry");
            fileEntry.createWriter((writer: any) => {
              // 写入文件成功完成的回调函数
              writer.onwrite = (e: any) => {
                resolve("写入本地文件");
              };
              // 写入数据
              writer.write(jsonString);
            });
          },
          (e: any) => {
            console.log("getFile failed: " + e.message);
          }
        );
      },
      (e) => {
        console.log(e.message);
      }
    );
  });
};

const dcFn = async () => {
  // uni.saveFile({
  //   tempFilePath: tempFilePaths[0],
  //   success: function (res: any) {
  //     var savedFilePath = res.savedFilePath;
  //   },
  // });
  const tempArr = [
    ...ccList.value
      .filter((item: any) => item.checked)
      .map((item: any) => item.tbjlbh),
    ...rcList.value
      .filter((item: any) => item.checked)
      .map((item: any) => item.tbjlbh),
    ...kjList.value
      .filter((item: any) => item.checked)
      .map((item: any) => item.tbjlbh),
  ];

  // 质检临时数组
  const zjTempArr = [
    // 定检
    ...djList.value
      .filter((item: any) => item.checked)
      .map((item: any) => item.tbjlbh),
    // 例检
    ...ljList.value
      .filter((item: any) => item.checked)
      .map((item: any) => item.tbjlbh),
  ];

  if (tempArr.length || zjTempArr.length) {
    const res: any = await exportData({
      sfscjl: sfscjl.value ? "Y" : "",
      tbjlbhList: tempArr,
      // 添加质检临时数组
      zjTempArr: zjTempArr,
    });

    if (res.code === 0) {
      uToastRef.value.show({
        type: "success",
        title: "默认主题",
        message: `文件存放至${res.data}`,
        duration: 5000,
      });
      requestFn();
    } else {
      uToastRef.value.show({
        type: "error",
        title: "失败主题",
        message: res.message,
      });
    }
  } else {
    uToastRef.value.show({
      type: "error",
      title: "失败主题",
      message: "至少选择一条数据",
    });
  }
};
</script>

<template>
  <view class="dclb">
    <view class="head">
      <view class="tssc">
        <up-checkbox
          usedAlone
          @change="tsscjlFn"
          :checked="sfscjl"
        ></up-checkbox>
        <up-text text="导出后同时删除登记记录"></up-text>
      </view>
    </view>

    <up-text type="primary" text="出厂登记"></up-text>

    <view class="box" v-for="item in ccList">
      <up-checkbox
        usedAlone
        @change="checkedFn(item)"
        :checked="item.checked"
      ></up-checkbox>
      <view class="left">
        <view class="top">
          <view>出厂至:{{ item.rczzmc }}公司</view>
          <view>数量:{{ item.sl ? item.sl : 0 }}</view>
        </view>

        <view class="bottom">
          <view class="sj">创建时间:{{ item.cjsj }}</view>
          <view class="sj dcsj" v-if="item.dcsj">导出时间:{{ item.dcsj }}</view>
        </view>
      </view>
      <image v-if="item.dcsj" class="ydc" :src="ydcBg" mode="scaleToFill" />
    </view>

    <up-text type="primary" text="入厂登记"></up-text>

    <view class="box" v-for="item in rcList">
      <up-checkbox
        usedAlone
        @change="checkedFn(item)"
        :checked="item.checked"
      ></up-checkbox>
      <view class="left">
        <view class="top">
          <view>出厂机构:{{ item.cczzmc }}公司</view>
          <view>数量:{{ item.sl ? item.sl : 0 }}</view>
        </view>

        <view class="bottom">
          <view class="sj">创建时间:{{ item.cjsj }}</view>
          <view class="sj dcsj" v-if="item.dcsj">导出时间:{{ item.dcsj }}</view>
        </view>
      </view>
      <image v-if="item.dcsj" class="ydc" :src="ydcBg" mode="scaleToFill" />
    </view>

    <up-text type="primary" text="库间调整"></up-text>

    <view class="box" v-for="item in kjList">
      <up-checkbox
        usedAlone
        @change="checkedFn(item)"
        :checked="item.checked"
      ></up-checkbox>
      <view class="left">
        <view class="top">
          <view>转入仓库:{{ item.zrckmc }}-{{ item.zrkqmc }}</view>
          <view>数量:{{ item.sl ? item.sl : 0 }}</view>
        </view>

        <view class="bottom">
          <view class="sj">创建时间:{{ item.cjsj }}</view>
          <view class="sj dcsj" v-if="item.dcsj">导出时间:{{ item.dcsj }}</view>
        </view>
      </view>
      <image v-if="item.dcsj" class="ydc" :src="ydcBg" mode="scaleToFill" />
    </view>

    <up-text type="primary" text="例检任务"></up-text>

    <view class="box" v-for="item in ljList">
      <up-checkbox
        usedAlone
        @change="checkedFn(item)"
        :checked="item.checked"
      ></up-checkbox>
      <view class="left">
        <view class="top">
          <view class="top-left">
            <text>{{ item.jclxmc }}</text>
            <text class="zjbh">{{ item.zjbh }}</text>
          </view>
          <view class="top-right"></view>
        </view>

        <view class="bottom">
          <view class="sj">检查数量:{{ item.jcsl ? item.jcsl : 0 }}</view>
          <view class="sj dcsj" v-if="item.dcsj">导出时间:{{ item.dcsj }}</view>
        </view>
      </view>
      <image v-if="item.dcsj" class="ydc" :src="ydcBg" mode="scaleToFill" />
    </view>

    <up-text type="primary" text="定检任务"></up-text>

    <view class="box" v-for="item in djList">
      <up-checkbox
        usedAlone
        @change="checkedFn(item)"
        :checked="item.checked"
      ></up-checkbox>
      <view class="left">
        <view class="top">
          <view class="top-left">
            <text>{{ item.jclxmc }}</text>
            <text class="zjbh">{{ item.zjbh }}</text>
          </view>
          <view class="top-right">
            检查月份:{{ item.jcyf ? item.jcyf : "无" }}
          </view>
        </view>

        <view class="bottom">
          <view class="sj">检查数量:{{ item.jcsl ? item.jcsl : 0 }}</view>
          <view class="sj dcsj" v-if="item.dcsj">导出时间:{{ item.dcsj }}</view>
        </view>
      </view>
      <image v-if="item.dcsj" class="ydc" :src="ydcBg" mode="scaleToFill" />
    </view>
  </view>

  <up-toast ref="uToastRef"></up-toast>
</template>
<style lang="scss" scoped>
.dclb {
  width: 750rpx;
  height: 100vh;
  background-color: #f3f3f3;
  padding: 30rpx;
  box-sizing: border-box;
  overflow: auto;
  :deep(.u-text) {
    margin-bottom: 20rpx !important;
  }

  .head {
    display: flex;
    margin-bottom: 20rpx;
    justify-content: flex-end;
    .tssc {
      display: flex;
      align-items: center;
      :deep(.u-text) {
        margin-bottom: 0rpx !important;
      }
    }
  }
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
          font-size: 30rpx;
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
          font-size: 22rpx;
        }

        .top-right {
          text-align: right;
          font-size: 22rpx;
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
}
:deep(.u-toast__content__text) {
  word-wrap: break-word; /* 支持长单词换行 */
  overflow-wrap: break-word; /* 处理长单词换行的现代属性 */
  white-space: normal; /* 默认换行行为 */
  word-break: break-all;
}
</style>

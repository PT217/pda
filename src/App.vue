<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  // console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  // console.log("App Hide");
});
</script>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-plus/index.scss";
@import "@/style/icon.scss";
// uni-page-body {
//   height: 100%;
// }
body {
  padding-bottom: env(safe-area-inset-bottom);
}
uni-page-head,
.uni-page-head,
.uni-tabbar-bottom,
.uni-tabbar,
.uni-tabbar__item {
  height: 100rpx !important;
}
uni-page-wrapper {
  height: calc(100% - 100rpx) !important;
}
.uni-page-head__title {
  line-height: 75rpx;
}
</style>

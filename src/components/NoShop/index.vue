<template>
  <!-- 排序 -->
  <view class="no-shop">
    <!-- <image class="no-shop-img" :src="imageObj[type]"></image>
    <uni-load-more status="noMore" :contentText="text" /> -->
  </view>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// import noShop from '@/static/no-shop.svg';
// import noCarShop from '@/static/no-car-shop.svg';

export default defineComponent({
  name: "noshop",
  props: {
    type: String,
    text: Object,
  },
  setup(props) {
    const { type = "shop", text } = props;
    // const imageObj: any = {
    //   car: noCarShop,
    //   shop: noShop,
    // };

    return {
      text,
      type,
      // imageObj,
    };
  },
});
</script>
<style lang="scss" scoped>
.no-shop {
  display: flex;
  flex-direction: column;
  align-items: center;
  // position: fixed;
  // top: 0;
  // left: 0;
  // width: 100vw;
  // height: 100vh;
  .no-shop-img {
    margin-top: 60px;
    width: 80px;
    height: 80px;
  }
}
</style>

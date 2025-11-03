<template>
  <view class="uni-margin-wrap" v-if="imgList?.length">
    <swiper
      class="swiper"
      :style="{ ...styleList }"
      circular
      :autoplay="autoplay"
      :interval="interval"
      :duration="duration"
    >
      <swiper-item v-for="(item, index) in imgList" :key="index">
        <image class="img" :mode="image.mode" :src="item.link || ''"></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { bannerProps } from './props';
import { ref } from 'vue';
const props = defineProps(bannerProps);
const { autoplay, interval, duration, data, image, handlerNavigate, styleList } = props;
const imgList = ref<any>([]);
watch(
  () => props.data,
  (newData) => {
    imgList.value = newData || [];
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.uni-margin-wrap {
  width: 100%;
}
.img {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <!-- 排序 -->
  <view
    class="shop-list-item"
    v-for="(shopItem, index) in shopList"
    :key="`${index}-${shopItem.sellCounts}}`"
    @click="() => handleClick(shopItem)"
  >
    <view class="i-image">
      <image :src="shopItem.imgUrl"></image>
    </view>
    <text class="title">{{ shopItem.itemName }}</text>
    <view class="i-number">
      <text class="i-number-price"
        >{{ shopItem.price }} <text class="integral">积分</text></text
      >
      <text class="i-number-sales"
        ><text class="inventory">销量</text>{{ shopItem.sellCounts }}</text
      >
    </view>
  </view>
</template>
<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

interface shopItemType {
  /** 商品图片名称 */
  imgUrl: string;
  /** 商品标题 */
  itemName: string;
  /** 商品价格 */
  price: number;
  /** 商品销售数据 */
  sellCounts: number;
}
type shopType = shopItemType[];

export default defineComponent({
  name: "classIfyMenu",
  props: {
    shopList: Array as PropType<shopType>,
    handlerNavigate: Function as PropType<((data: Object) => void) | undefined>,
  },
  setup(props) {
    const { shopList, handlerNavigate } = props;

    const handleClick = (data: any) => {
      handlerNavigate && handlerNavigate(data);
    };

    return {
      shopList,
      handleClick,
    };
  },
});
</script>
<style lang="scss">
.shop-list-item {
  padding-bottom: 12px;
  margin-bottom: 20px;
  width: 48%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  .title {
    padding: 0 10px;
    font-size: 14px;
    // color: $lel_text;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
.shop-list-item .i-image {
  margin-bottom: 10px;
  width: 100%;
  height: 171px;
  // background: $lel_border_line;
  border-radius: 5px 5px 0 0;
  image {
    width: 100%;
    height: 100%;
  }
}
.shop-list-item .i-number {
  padding: 0 10px;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &-price {
    font-size: 16px;
    // color: $lel_text_money_h;
    .integral {
      font-size: 12px;
    }
  }
  &-sales {
    font-size: 12px;
    // color: $lel_text_grey;
  }
}
</style>

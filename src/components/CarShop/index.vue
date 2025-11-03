<template>
  <view class="car-content">
    <view
      class="car-shop"
      v-for="carShopItem in shopData"
      :key="carShopItem.specId"
    >
      <uni-swipe-action style="width: 100%">
        <uni-swipe-action-item
          :right-options="options"
          @click="() => handleDeleted(carShopItem)"
        >
          <view class="car-shop-content">
            <view class="shop-radio" @click="() => handleChoose(carShopItem)">
              <view v-if="!carShopItem.checked" class="shop-radio-check"></view>
              <view v-else class="shop-radio-checked"
                ><image :src="ShopRadioChecked"></image
              ></view>
            </view>
            <!-- 商品信息 -->
            <view class="shop">
              <image
                class="shop-img"
                :src="carShopItem.itemImgUrl"
                mode="scaleToFill"
                @click="() => handleShopToDetail(carShopItem)"
              ></image>
              <view class="shop-info">
                <view class="shop-info-point">{{ carShopItem.itemName }}</view>
                <view class="shop-info-spec">
                  <text class="spec">{{ carShopItem.specName }}</text>
                  <view class="point-number">
                    <text class="point">{{ carShopItem.priceNormal }}积分</text>
                    <uni-number-box
                      :min="1"
                      class="point-number-box"
                      v-model="carShopItem.buyCounts"
                      @change="(data:any) => calcCarCheckShopPaymentPriceCallback(data, carShopItem)"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </view>
  </view>
</template>
<script setup lang="ts">
import ShopRadioChecked from "@/static/pay-success-icon.png";
import { getCurrentInstance, ref } from "vue";
import { reactive } from "vue";
import { watch } from "vue";
interface CarShopInterface {
  carShopData: any[];
  handleChooseCallback: Function;
  calcCarCheckShopPaymentPriceCallback: Function;
  handleDeleted: Function;
  handleShopToDetail: Function;
  callbackAllShopHeight: Function;
}
const instance = getCurrentInstance();
const props = defineProps<CarShopInterface>();
const {
  handleChooseCallback,
  calcCarCheckShopPaymentPriceCallback,
  handleDeleted,
  callbackAllShopHeight,
} = props;
const shopData: any[] = reactive([]);
const options = ref([
  {
    text: "删除",
    style: {
      backgroundColor: "#dd524d",
    },
  },
]);

watch(
  () => props.carShopData,
  (val) => {
    const query = uni.createSelectorQuery().in(instance);
    shopData.length = 0;
    val.forEach((item) => shopData.push(item));

    query.select(".car-content").boundingClientRect();
    query.exec((data: any) => {
      callbackAllShopHeight && callbackAllShopHeight(data[0]?.height || 0);
      // carShopBox = data?.height || 0;
    });
  },
  {
    immediate: true,
  }
);

const handleChoose = (shopItem: any) => {
  handleChooseCallback && handleChooseCallback(shopItem);
};
</script>

<style lang="scss">
.car-content {
  padding-bottom: 10px;
}
.car-shop {
  margin-top: 15px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  .car-shop-content {
    display: flex;
  }
  .shop-radio {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 109px;
    overflow: hidden;
  }
  // 商品信息
  .shop {
    flex: 1;
    margin-top: 15px;
    padding-bottom: 11px;
    // height: 87px;
    display: flex;
    flex-direction: row;
    &-img {
      width: 87px;
      height: 87px;
      border-radius: 6px;
    }
    &-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 10px;
      &-point {
        font-size: 15px;
        color: #333333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      &-spec {
        font-size: 12px;
        color: #999999;
        text {
          display: block;
        }
        .point-number {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          .point {
            color: #3e43e6;
            font-size: 14px;
            font-weight: bold;
          }
          &-box {
            margin-right: 16px;
          }
        }
      }
    }
  }
}
.shop-radio-check {
  width: 12px;
  height: 12px;
  border: 1px solid #999999;
  border-radius: 50%;
}
.shop-radio-checked {
  display: flex;
  align-items: center;
  width: 14px;
  height: 14px;
  image {
    width: 15px;
    height: 15px;
  }
}
.uni-swipe_text--center {
  display: flex !important;
}
</style>

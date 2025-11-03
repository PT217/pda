<template>
  <view class="spec">
    <uni-popup class="popup" ref="specBox" type="bottom" @maskClick="handleChangeSpecPopup" background-color="#ffffff">
      <view class="popup-content">
        <!-- 商品信息 -->
        <view class="shop">
          <image class="shop-img" :src="specData.banner[0]?.link || ''" mode="scaleToFill"></image>
          <view class="shop-info">
            <view class="shop-info-point">{{ chooseSpec?.priceNormal }}积分</view>
            <view class="shop-info-spec">
              <text>剩余{{ chooseSpec?.stock || 0 }}件</text>
              <text>{{ !chooseSpec?.spec ? '请选择规格' : chooseSpec.spec }}</text>
            </view>
          </view>
        </view>

        <!-- 商品规格列表 -->
        <view class="spec-box">
          <view class="spec-content" v-for="(shopSpecDataItem, index) in shopSpecDataReactive.spec" :key="index">
            <!-- <text class="spec-box-label">{{ shopSpecDataItem.type }}</text> -->
            <view class="spec-box-list">
              <view
                v-for="(item, itemIndex) in shopSpecDataItem.list"
                :class="['spec-box-list-item', item?.checked && 'specItemChecked'].join(' ')"
                @click="() => handleSpecItemClick(item, shopSpecDataItem, index, itemIndex)"
                :key="item.id"
                >{{ item.name }}</view
              >
            </view>
          </view>
        </view>

        <!-- 购买数量 -->
        <view class="shop-number">
          <text class="shop-number-label">兑换数量</text>
          <uni-number-box v-model="shopNumber" :min="1" @change="handleChangeShopNumberPopup" />
        </view>
      </view>
      <view class="empty"></view>
      <view class="btn-box">
        <view
          :class="['btn', !chooseSpec && 'payBtn', !isPay && type == 'pay' && 'pay-btn-ok-disabled'].join(' ')"
          @click="handleClick"
        >
          {{ betText }}
        </view>
      </view>
      <uni-icons class="close" type="closeempty" size="24" @click="handleClose"></uni-icons>
    </uni-popup>
  </view>
</template>

<script lang="ts">
import { computed, watch, reactive, ref, defineComponent } from 'vue';

export default defineComponent({
  name: 'shopSpecChoose',
  props: {
    specData: {
      type: Object,
      required: true,
    },
    show: {
      type: Boolean,
    },
    chooseShopNumber: {
      type: Number,
      default: 1,
    },
    specType: {
      type: String,
    },
    img: {
      type: String,
    },
    specBtnText: {
      type: Object,
    },
    chooseSpecIsPay: { type: Boolean },
    handleChangeSpecPopup: { type: Function },
    handleChooseSpec: { type: Function },
    handleChangeShopNumber: { type: Function },
    handleToPay: { type: Function },
  },
  setup(props) {
    const {
      specData,
      handleChangeSpecPopup,
      handleChooseSpec,
      chooseShopNumber,
      handleChangeShopNumber,
      handleToPay,
      specType,
      specBtnText,
      img,
      chooseSpecIsPay,
    } = props;

    const specBox = ref<any>(null);
    const shopNumber = ref(chooseShopNumber);
    let shopSpecDataReactive = reactive<any>(specData);
    const betText = ref('');
    const isPay = ref(false);
    const type = ref('pay');

    // 监听是否选择了商品规格
    const chooseSpec = computed(() => {
      let list: any = {
        spec: 0,
        stock: 0,
      };
      if (!shopSpecDataReactive.spec) return;
      shopSpecDataReactive.spec.forEach((specItem: any) => {
        if (specItem.list && specItem.list.length) {
          let spec = specItem.list.filter((item: any) => item.checked);
          if (spec.length) {
            list.spec = `${spec[0].name}; `;
            list.stock = spec[0].stock;
            list.priceNormal = spec[0].priceNormal;
          }
          spec.length && (list.spec = `${spec[0].name}; `);
          spec.length && (list.stock = spec[0].stock);
        }
      });
      return list;
    });

    // 格式化规格数据, 将每个规格都加上checked属性
    const formatData = (data: any): any => {
      if (!Array.isArray(data)) return '';
      data.forEach((dataItem: any, dataIndex: number) => {
        if (Array.isArray(dataItem.list)) {
          return formatData(dataItem.list);
        }
        dataItem.checked = false;
      });

      return data;
    };

    watch(
      () => props.show,
      (val) => {
        if (val) {
          specBox.value.open && specBox.value.open();
          let list = specData.spec[0]?.list || [];
          let index = list.findIndex((item: any) => item.checked);
          index = index < 0 ? 0 : index;

          handleSpecItemClick({}, {}, 0, index);
        } else specBox.value.close && specBox.value.close();
      }
    );

    watch(
      () => props.specData,
      (val) => {
        shopSpecDataReactive.spec = val.spec;
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.specType,
      (val) => {
        betText.value = props.specBtnText ? props.specBtnText[props.specType || 'pay'] : '';
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.chooseSpecIsPay,
      (val) => {
        isPay.value = val;
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.specType,
      (val) => {
        type.value = val || 'pay';
      },
      {
        immediate: true,
      }
    );

    /**
     * 立即兑换
     */
    const handleClick = () => {
      if (!chooseSpec.value) {
        uni.showToast({
          title: '规格不能为空',
          icon: 'none',
        });
        return;
      }
      handleToPay && handleToPay();
    };

    /**
     * 关闭弹框
     */
    const handleClose = () => {
      handleChangeSpecPopup && handleChangeSpecPopup();
      specBox.value.close();
    };

    const handleSpecItemClick = (specItem: any, pre: any, index: number, itemIndex: number) => {
      shopSpecDataReactive.spec = formatData(shopSpecDataReactive.spec);
      shopSpecDataReactive.spec[index].list[itemIndex].checked = true;

      handleChooseSpec && handleChooseSpec(shopSpecDataReactive);
    };
    const handleChangeShopNumberPopup = (val: number) => {
      handleChangeShopNumber && handleChangeShopNumber({ chooseShopNumber: val });
    };

    return {
      specBox,
      shopSpecDataReactive,
      chooseSpec,
      handleChangeSpecPopup,
      shopNumber,
      specType,
      specBtnText,
      betText,
      img,
      chooseSpecIsPay,
      isPay,
      type,
      handleClick,
      handleClose,
      handleSpecItemClick,
      handleChangeShopNumberPopup,
    };
  },
});
</script>

<style lang="scss">
.spec {
  position: fixed;
  top: 110px;
  .popup {
    position: relative;
  }
  .popup-content {
    border-radius: 5px 5px 0px 0px;
    display: flex;
    flex-direction: column;
    padding: 17px 12px 0 12px;
    background-color: #ffffff !important;
    overflow: hidden;
    // 商品信息
    .shop {
      padding-bottom: 11px;
      width: 100%;
      height: 87px;
      display: flex;
      flex-direction: row;
      border-bottom: 1px solid #e5e5e5;
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
          color: #3e43e6;
        }
        &-spec {
          font-size: 12px;
          color: #999999;
          text {
            display: block;
          }
        }
      }
    }

    // 商品规格列表
    .spec-box {
      margin-top: 8px;
      padding-bottom: 11px;
      border-bottom: 1px solid #e5e5e5;
      .spec-content {
        margin-top: 11px;
        &:first-child {
          margin-top: 0;
        }
      }
      &-label {
        display: block;
        font-size: 15px;
        color: #999999;
      }
      &-list {
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        &-item {
          margin-top: 5px;
          padding: 4px 6px;
          background-color: #f6f6f6;
          border-radius: 2px;
          font-size: 13px;
          color: #333333;
          margin-right: 13px;
        }
      }
    }

    // 购买数量
    .shop-number {
      margin: 23px 0 54px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      &-label {
        font-size: 13px;
        color: #999999;
      }
    }
  }
  .empty {
    height: 18px;
    background-color: #f6f6f6;
  }
  // 兑换按钮
  .btn-box {
    padding-top: 8px;
    background-color: #ffffff;
    height: 60px;
    .btn {
      width: 90%;
      height: 40px;
      margin: 0 auto;
      border-radius: 5px;
      background-color: #3e43e6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 16px;
    }
  }
  .close {
    position: absolute;
    top: 17px;
    right: 13px;
    text {
      color: #cccccc !important;
    }
  }
}

.specItemChecked {
  border: 1px solid #3e43e6;
  background-color: #dcddff !important;
  color: #3e43e6 !important;
}

.payBtn {
  opacity: 0.4;
}

.pay-btn-ok-disabled {
  opacity: 0.5;
}
</style>

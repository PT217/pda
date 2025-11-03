<template>
  <!-- 排序 -->
  <view class="shop-utils">
    <view class="shop-sort">
      <view class="shop-sort-item" @click="showFilterContent">
        <text>{{ sortChecked.label }}</text>
        <image
          :class="['shop-sort-item-icon', show && 'icon-rotate'].join(' ')"
          mode="aspectFill"
          src="~/@/static/down.png"
        />
      </view>
    </view>
    <view v-show="show" class="filter-popup">
      <view :class="['filter-popup-box', show && 'box-animation'].join(' ')">
        <view
          v-for="pointFilterItem in utils.points.children"
          :key="pointFilterItem.key"
          class="popup-item"
          @click="() => handleFilterItem(pointFilterItem)"
          >{{ pointFilterItem.label }}</view
        >
      </view>
      <view class="filter-empty" @click="showFilterContent" />
    </view>

    <!-- <view class="shop-more">
      <text>更多</text>
      <image class="shop-sort-item-icon" mode="aspectFill" src="~/@/static/more.png" />
    </view> -->
  </view>
</template>
<script lang="ts">
import { reactive } from "vue";
import { ref } from "vue";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "ShopFilterSort",
  props: {
    handleFilter: {
      type: Function,
    },
  },
  setup(props) {
    const { handleFilter } = props;
    let show = ref(false);

    // {k: 默认，代表默认排序，根据name, c: 根据销量排序, p: 根据价格排序}
    const utils = reactive({
      points: {
        checked: "k",
        children: [
          {
            label: "默认排序",
            key: "k",
          },
          {
            label: "积分从低到高",
            key: "p",
          },
          {
            label: "积分从高到低",
            key: "pd",
          },
          {
            label: "总兑量从高到低",
            key: "c",
          },
        ],
      },
    });

    // 监听被选择项
    const sortChecked = computed(
      () =>
        utils.points.children.filter(
          (item) => item.key === utils.points.checked
        )[0]
    );

    /**
     * 点击排序项
     * @param {Object} pointFilterItem 点击项的数据
     * @returns void
     */
    const handleFilterItem = (pointFilterItem: any) => {
      if (!pointFilterItem) return;
      utils.points.checked = pointFilterItem.key;
      handleFilter && handleFilter(pointFilterItem);
      showFilterContent();
    };

    /**
     * 筛选组件的显示与隐藏
     * @returns void
     */
    const showFilterContent = () => {
      show.value = !show.value;
    };

    return {
      sortChecked,
      utils,
      show,
      handleFilterItem,
      showFilterContent,
    };
  },
});
</script>
<style lang="scss">
.shop-utils {
  position: relative;
  padding: 10px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 13px;
  // color: $lel_text_grey;
  background-color: #f6f6f6;
  .filter-popup {
    position: fixed;
    top: 130px;
    left: 0;
    width: 100vw;
    z-index: 991;
    &-box {
      height: 0;
      text-align: center;
      overflow: hidden;
      background-color: #ffffff;
      .popup-item {
        padding: 12px 10px;
        border-bottom: 1px solid #f5f5f5;
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .filter-empty {
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
}

.box-animation {
  animation: popupHeight 0.3s forwards;
}
.icon-rotate {
  transform: rotate(180deg) translateY(-1px);
  transform-origin: center;
}
@keyframes popupHeight {
  from {
    height: 0;
  }
  to {
    height: 172px;
  }
}
.shop-sort {
  flex: 1;
  padding-right: 10px;
  display: flex;
  flex-direction: row;
}
.shop-sort-item {
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
}
.shop-sort-item.line::after {
  content: "";
  position: absolute;
  height: 80%;
  width: 2px;
  // border-left: 1px solid $lel_border_line;
  right: 0;
  top: 50%;
  transform: translateY(-40%);
  &:first-child {
    width: 0;
  }
}
.shop-sort-item:first-child {
  padding-left: 0;
}
.shop-sort-item-icon {
  margin-left: 5px;
  width: 10px;
  height: 10px;
}

.shop-more {
  padding-left: 6px;
  width: 60px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>

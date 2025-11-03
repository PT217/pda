<template>
  <!-- 商品一级菜单 -->
  <scroll-view class="shop-swiper" scroll-x enable-flex>
    <view class="shop-type-menu">
      <view
        :class="['shop-type-menu-item', item.active && 'active']"
        v-for="(item, index) in menus"
        :key="index"
        @click="handleMenus(item)"
        >{{ item.name }}</view
      >
    </view>
  </scroll-view>
</template>
<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

interface menusItemType {
  /** 菜单名称 */
  name: string;
  /** 菜单索引 */
  id: number;
  /** 菜单选中状态 */
  active: boolean;
}
type menusType = menusItemType[];

export default defineComponent({
  name: "classIfyMenu",
  props: {
    menus: {
      type: Array as PropType<menusType>,
      required: true,
    },
    handlerNavigate: {
      type: Function as PropType<((data: Object) => void) | undefined>,
    },
  },
  setup(props) {
    const { menus, handlerNavigate } = props;

    function handleMenus(menu: menusItemType) {
      menus.map((item) => {
        if (item.active) item.active = false;
        if (item.id === menu.id) item.active = true;
      });
      handlerNavigate && handlerNavigate(menu);
    }

    return {
      menus,
      handleMenus,
    };
  },
});
</script>
<style lang="scss">
.shop-swiper {
  position: sticky;
  top: 0;
  // border-bottom: 1px solid $lel_border_line;
  background-color: #ffffff;
  z-index: 100;
}
.shop-type-menu {
  white-space: nowrap;
}
.shop-type-menu-item {
  font-size: 14px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: inline-block;
  margin-left: 16px;
  // color: $lel_text;
}
.shop-type-menu-item:last-child {
  margin-right: 20px;
}
.shop-type-menu-item.active {
  position: relative;
  // color: $lel_text_checked;
  font-weight: bold;
}
.shop-type-menu-item.active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-15px, 0px);
  width: 30px;
  height: 2px;
  background-color: #3e43e6;
  border-radius: 1px;
}
</style>

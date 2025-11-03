<template>
  <!-- 搜索 -->
  <div class="search">
    <uni-search-bar
      v-model="value"
      placeholder="搜索关键字"
      radius="20"
      class="uni-search"
      justifyContent="left"
      style="justify-content: left"
      @confirm="() => handleCancel(value)"
      @cancel="() => handleCancel()"
      @clear="() => handleCancelC()"
    />
    <div v-if="disabled === 'true'" class="search-empty" @click="handlerNavigate"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import UniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue';
import { ref, watch } from 'vue';

export default defineComponent({
  name: 'classIfyMenu',
  extends: UniSearchBar,
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    searchValue: {
      type: String,
    },
    handlerNavigate: {
      type: Function,
    },
    handleCancel: {
      type: Function,
    },
    handleClear: {
      type: Function,
    },
  },
  setup(props) {
    const { disabled, searchValue, handlerNavigate, handleCancel, handleClear } = props;

    let value = ref<string>(searchValue || '');

    // 监听搜索数据的变化
    watch(
      () => props.searchValue,
      (newValue) => {
        if (newValue === '') return;
        value.value = newValue || '';
      },
      {
        immediate: true,
      }
    );

    const handleCancelC = () => {
      try {
        handleClear && handleClear();
      } catch (error) {
        console.error('异常: ', error);
      }
    };

    return {
      disabled,
      handlerNavigate,
      handleCancel,
      handleCancelC,
      value,
      searchValue,
    };
  },
});
</script>
<style lang="scss">
.search {
  position: relative;
  width: 100%;
  height: 56px;
  background-color: #ffffff;
  .search-empty {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
<style>
.uni-searchbar__box {
  justify-content: left !important;
}
.uni-searchbar__box-icon-search {
  padding-right: 0 !important;
}
::v-deep .uni-searchbar__text-placeholder {
  flex: 1 !important;
}
</style>

import type { PropType } from 'vue';

interface SwiperInterface {
  link?: string;
}
interface ImageInterface {
  mode: string;
  [key: string]: unknown;
}

export const bannerProps = {
  autoplay: {
    type: Boolean,
    default: true,
  },
  interval: {
    type: Number,
    default: 2000,
  },
  duration: {
    type: Number,
    default: 500,
  },
  data: {
    type: Array<SwiperInterface>
  },
  image: {
    type: Object as PropType<ImageInterface>,
    default: {
      mode: 'aspectFill',
    },
  },
  handlerNavigate: {
    type: Function,
  },
  /** 样式 object类型 {height: 100rpx} */
  styleList: {
    type: Object,
    default: {
      height: '154px',
    },
  },
};

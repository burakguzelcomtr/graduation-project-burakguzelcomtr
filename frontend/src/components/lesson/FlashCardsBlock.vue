<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const modules = [Navigation, Pagination]
const activeIndex = ref(0)

function onSlideChange(swiper) {
  activeIndex.value = swiper.activeIndex
}
</script>

<template lang="pug">
.lp-flash-cards
  swiper.lp-flash-cards__swiper(
    :modules="modules"
    :slides-per-view="1"
    :space-between="0"
    :navigation="true"
    :pagination="{ clickable: true }"
    :centered-slides="true"
    @slideChange="onSlideChange"
  )
    swiper-slide.lp-flash-cards__slide(
      v-for="(url, index) in items"
      :key="index"
    )
      .lp-flash-cards__poster
        img.lp-flash-cards__img(:src="url" :alt="`Card ${index + 1}`" loading="lazy")
</template>

<style lang="scss" scoped>
.lp-flash-cards {
  width: 100%;
  margin: 24px 0;

  &__swiper {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
  }

  &__slide {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9fafb;
  }

  &__poster {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 16px;
  }

  &__img {
    max-width: 100%;
    max-height: 520px;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    display: block;
    margin: 0 auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #de7534;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 40px;
  height: 40px;

  &::after {
    font-size: 16px;
    font-weight: 900;
  }
}

:deep(.swiper-pagination-bullet-active) {
  background: #de7534;
}
</style>

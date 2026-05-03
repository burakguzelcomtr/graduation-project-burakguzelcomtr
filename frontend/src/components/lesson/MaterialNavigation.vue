<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  prevItem: { type: Object, default: null },
  nextItem: { type: Object, default: null },
  isLast: { type: Boolean, default: false },
  lessonSlug: { type: String, required: true },
  unitSlug: { type: String, required: true },
})

const router = useRouter()

function itemId(item) {
  return item?.item?._id ?? item?._id
}

function itemTitle(item) {
  return item?.item?.title ?? item?.title ?? ''
}

function itemType(item) {
  return item?.item?.type ?? item?.type ?? 'topic'
}

function navigateToItem(item) {
  const id = itemId(item)
  if (!id) return
  router.push({
    name: 'material-detail',
    params: { lessonSlug: props.lessonSlug, unitSlug: props.unitSlug, materialId: id },
  })
}

function finishUnit() {
  router.push({
    name: 'unit-detail',
    params: { lessonSlug: props.lessonSlug, unitSlug: props.unitSlug },
  })
}
</script>

<template lang="pug">
nav.lp-material-nav(v-if="prevItem || nextItem || isLast")
  button.lp-material-nav__btn.lp-material-nav__btn--prev(
    v-if="prevItem"
    type="button"
    @click="navigateToItem(prevItem)"
  )
    span.lp-material-nav__dir Previous

  .lp-material-nav__spacer(v-else)

  button.lp-material-nav__btn.lp-material-nav__btn--next(
    v-if="nextItem"
    type="button"
    @click="navigateToItem(nextItem)"
  )
    span.lp-material-nav__dir Next

  button.lp-material-nav__btn.lp-material-nav__btn--finish(
    v-else-if="isLast"
    type="button"
    @click="finishUnit"
  )
    span.lp-material-nav__dir Finish Unit
</template>

<style lang="scss" scoped>
.lp-material-nav {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding: 48px;
  background-color: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 14px;

  &__spacer {
    flex: 1;
  }

  &__btn {
    width: 320px;
    height: 132px;
    border: none;
    background: url('/assets/img/button-bg.svg') no-repeat center;
    background-size: 320px 132px;
    cursor: pointer;
    font-family: 'Fredoka', sans-serif;
    text-align: center;
    position: relative;
    transition: all 0.15s;

    &:hover {
      transform: translateY(-2px) scale(1.01);
    }

    &--next,
    &--finish {
      margin-left: auto;
    }
  }

  &__dir {
    display: block;
    position: absolute;
    top: 24px;
    left: 0;
    width: 100%;
    font-family: 'Fredoka', 'Segoe UI', sans-serif;
    color: #6f2c21;
    font-size: 28px;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 2px;
    text-shadow:
      1px 1px #da7e70,
      -1px -1px #dbbea5;
    text-align: center;
    height: 48px;
    transition: all ease 0.2s;

    .lp-material-nav__btn:hover & {
      text-shadow:
        1px 1px #ddd,
        -1px -1px #da7e70;
    }
  }

  &__label {
    display: block;
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    padding: 0 16px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    color: #6f2c21;
    opacity: 0.7;

    &--quiz {
      color: #92400e;
    }

    &--topic {
      color: #1d4ed8;
    }
  }
}
</style>

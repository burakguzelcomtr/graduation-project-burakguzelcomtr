<script setup>
import { computed } from 'vue'
import FlashCardsBlock from './FlashCardsBlock.vue'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

/**
 * Parses the content string into segments:
 *   { type: 'html', content: '...' }
 *   { type: 'pdf', url: '...' }
 *   { type: 'flash_cards', items: ['url1', 'url2', ...] }
 */
const segments = computed(() => {
  if (!props.content) return []

  const result = []

  // Combined pattern: matches [pdf url="..."] or [flash_cards]...[/flash_cards]
  const shortcodePattern =
    /\[pdf\s+url="([^"]+)"\s*\]|\[flash_cards\]([\s\S]*?)\[\/flash_cards\]/gi

  let lastIndex = 0
  let match

  while ((match = shortcodePattern.exec(props.content)) !== null) {
    // Push any HTML text before this match
    if (match.index > lastIndex) {
      const htmlChunk = props.content.slice(lastIndex, match.index)
      if (htmlChunk.trim()) {
        result.push({ type: 'html', content: htmlChunk })
      }
    }

    if (match[1] !== undefined) {
      // [pdf url="..."]
      result.push({ type: 'pdf', url: match[1] })
    } else if (match[2] !== undefined) {
      // [flash_cards]...[/flash_cards]
      const inner = match[2]
      const itemPattern = /\[item\s+url="([^"]+)"\s*\/?]/gi
      const items = []
      let itemMatch
      while ((itemMatch = itemPattern.exec(inner)) !== null) {
        items.push(itemMatch[1])
      }
      if (items.length) {
        result.push({ type: 'flash_cards', items })
      }
    }

    lastIndex = match.index + match[0].length
  }

  // Push any remaining HTML after the last shortcode
  if (lastIndex < props.content.length) {
    const remaining = props.content.slice(lastIndex)
    if (remaining.trim()) {
      result.push({ type: 'html', content: remaining })
    }
  }

  // If no shortcodes found, treat the whole content as HTML
  if (result.length === 0 && props.content.trim()) {
    result.push({ type: 'html', content: props.content })
  }

  return result
})
</script>

<template lang="pug">
.lp-content-renderer
  template(v-for="(segment, index) in segments" :key="index")

    //- Plain HTML
    div.lp-content-renderer__html(
      v-if="segment.type === 'html'"
      v-html="segment.content"
    )

    //- PDF embed
    .lp-content-renderer__pdf-wrap(v-else-if="segment.type === 'pdf'")
      iframe.lp-content-renderer__pdf(
        :src="segment.url"
        frameborder="0"
        allowfullscreen
        width="100%"
        height="800px"
        title="PDF Document"
      )

    //- Flash cards (Swiper poster slider)
    FlashCardsBlock(
      v-else-if="segment.type === 'flash_cards'"
      :items="segment.items"
    )
</template>

<style lang="scss" scoped>
.lp-content-renderer {
  line-height: 1.8;
  color: #374151;
  font-size: 15.2px;

  &__html {
    :deep(h1),
    :deep(h2),
    :deep(h3) {
      margin: 1.2em 0 0.4em;
      color: #1a202c;
      font-weight: 700;
    }

    :deep(p) {
      margin: 0 0 1em;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 1.5em;
      margin-bottom: 1em;
    }
  }

  &__pdf-wrap {
    position: relative;
    width: 100%;
    margin: 24px 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    background: #f3f4f6;
    aspect-ratio: 4 / 3;
  }

  &__pdf {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>

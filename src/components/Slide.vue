<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const SLIDE_W = 1280
const SLIDE_H = 720

const outer = ref(null)
const scale = ref(1)
let ro = null

function update() {
  if (!outer.value) return
  const w = outer.value.clientWidth
  const h = outer.value.clientHeight
  if (w === 0 || h === 0) return
  scale.value = Math.min(w / SLIDE_W, h / SLIDE_H)
}

onMounted(() => {
  ro = new ResizeObserver(update)
  ro.observe(outer.value)
  update()
  // Recompute on print transitions — Chrome resizes the viewport for @page.
  window.addEventListener('beforeprint', update)
  window.addEventListener('afterprint', update)
})

onUnmounted(() => {
  ro?.disconnect()
  window.removeEventListener('beforeprint', update)
  window.removeEventListener('afterprint', update)
})
</script>

<template>
  <div ref="outer" class="slide-outer">
    <div class="slide-inner" :style="{ transform: `scale(${scale})` }">
      <slot />
    </div>
  </div>
</template>

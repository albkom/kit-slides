import { ref, computed, onMounted, onUnmounted } from 'vue'

export const SLIDE_W = 1280
export const SLIDE_H = 720

export function useSlideScale() {
  const container = ref(null)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  const scale = computed(() =>
    Math.min(containerWidth.value / SLIDE_W, containerHeight.value / SLIDE_H),
  )

  function resize() {
    if (!container.value) return
    containerWidth.value = container.value.clientWidth
    containerHeight.value = container.value.clientHeight
  }

  onMounted(() => {
    resize()
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })

  return { container, scale }
}

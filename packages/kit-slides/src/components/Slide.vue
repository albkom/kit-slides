<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted } from "vue";

interface Props {
  slideNumber?: number | null;
  totalSlides?: number | null;
  deckNote?: string | null;
  note?: string | null;
  logo?: string | null;
  department?: string | null;
  isCover?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  slideNumber: null,
  totalSlides: null,
  deckNote: null,
  note: null,
  logo: null,
  department: null,
  isCover: false,
});

provide(
  "slideTopper",
  computed(() => ({ logo: props.logo, department: props.department })),
);

const SLIDE_W = 1280;
const SLIDE_H = 720;

const outer = ref<HTMLDivElement | null>(null);
const scale = ref(1);
let ro: ResizeObserver | null = null;

function update() {
  if (!outer.value) return;
  const w = outer.value.clientWidth;
  const h = outer.value.clientHeight;
  if (w === 0 || h === 0) return;
  scale.value = Math.min(w / SLIDE_W, h / SLIDE_H);
}

onMounted(() => {
  ro = new ResizeObserver(update);
  if (outer.value) ro.observe(outer.value);
  update();
  window.addEventListener("beforeprint", update);
  window.addEventListener("afterprint", update);
});

onUnmounted(() => {
  ro?.disconnect();
  window.removeEventListener("beforeprint", update);
  window.removeEventListener("afterprint", update);
});
</script>

<template>
  <div ref="outer" class="slide-outer">
    <div class="slide-inner" :style="{ transform: `scale(${scale})` }">
      <slot />
      <!-- bottom-center branding: cover only -->
      <div
        v-if="props.isCover && (props.logo || props.department)"
        class="slide-cover-brand"
      >
        <img
          v-if="props.logo"
          :src="props.logo"
          class="slide-logo"
          alt="logo"
        />
        <span v-if="props.department" class="slide-dep">{{
          props.department
        }}</span>
      </div>
      <div class="slide-footer">
        <div class="slide-footer__left">
          <span v-if="props.deckNote && !props.isCover" class="slide-note">{{
            props.deckNote
          }}</span>
          <span v-if="props.note" class="slide-note slide-note--slide">{{
            props.note
          }}</span>
        </div>
        <span v-if="props.slideNumber !== null" class="slide-number"
          >{{ props.slideNumber
          }}<template v-if="props.totalSlides !== null">
            / {{ props.totalSlides }}</template
          ></span
        >
      </div>
    </div>
  </div>
</template>

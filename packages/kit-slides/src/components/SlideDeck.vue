<script setup lang="ts">
import {
  ref,
  computed,
  provide,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
} from "vue";
import type { Component } from "vue";

export interface DeckSlide {
  component: Component;
  props?: Record<string, unknown>;
  isCover?: boolean;
  note?: string;
}

const props = withDefaults(
  defineProps<{
    slides: DeckSlide[];
    logo?: string;
    department?: string;
    deckNote?: string;
    defaultView?: "slide" | "document";
  }>(),
  {
    logo: undefined,
    department: undefined,
    deckNote: undefined,
    defaultView: "slide",
  },
);

const emit = defineEmits<{ "update:view": ["slide" | "document"] }>();

// Topper (logo + department) provided to any descendant SlideTopper.
provide(
  "slideTopper",
  computed(() => ({
    logo: props.logo ?? null,
    department: props.department ?? null,
  })),
);

const isDocument = ref(props.defaultView === "document");
watch(isDocument, (v) => emit("update:view", v ? "document" : "slide"));

function printPdf() {
  window.print();
}

const contentCount = computed(
  () => props.slides.filter((s) => !s.isCover).length,
);

function slideNumber(s: DeckSlide, i: number): number | null {
  if (s.isCover) return null;
  return props.slides.slice(0, i).filter((x) => !x.isCover).length + 1;
}

// ── Scale-to-fit (1280×720 design canvas) ────────────────────────────────────
const SLIDE_W = 1280;
const SLIDE_H = 720;
const scale = ref(1);
const outerEls = ref<HTMLElement[]>([]);
let ro: ResizeObserver | null = null;

function setOuter(el: Element | null, i: number) {
  if (el) outerEls.value[i] = el as HTMLElement;
}

function update() {
  const el = outerEls.value.find(Boolean);
  if (!el) return;
  const w = el.clientWidth;
  const h = el.clientHeight;
  if (w === 0 || h === 0) return;
  scale.value = Math.min(w / SLIDE_W, h / SLIDE_H);
}

function observeAll() {
  if (!ro) return;
  ro.disconnect();
  outerEls.value.forEach((el) => el && ro!.observe(el));
  update();
}

watch(
  () => props.slides.length,
  () => nextTick(observeAll),
);

onMounted(() => {
  ro = new ResizeObserver(update);
  observeAll();
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
  <div class="deck">
    <div class="toolbar">
      <button class="btn-primary" @click="printPdf">⬇ Scarica PDF</button>
      <label class="toggle-label" aria-label="Modalità documento">
        <input type="checkbox" role="switch" v-model="isDocument" />
        Infinite scroll
      </label>
    </div>

    <div class="stage" :class="{ 'stage--document': isDocument }">
      <div v-for="(s, i) in slides" :key="i" class="slide-page">
        <div class="slide-outer" :ref="(el) => setOuter(el as Element | null, i)">
          <div class="slide-inner" :style="{ transform: `scale(${scale})` }">
            <component :is="s.component" v-bind="s.props ?? {}" />

            <div
              v-if="s.isCover && (logo || department)"
              class="slide-cover-brand"
            >
              <img v-if="logo" :src="logo" class="slide-logo" alt="logo" />
              <span v-if="department" class="slide-dep">{{ department }}</span>
            </div>

            <div class="slide-footer">
              <div class="slide-footer__left">
                <span v-if="deckNote && !s.isCover" class="slide-note">{{
                  deckNote
                }}</span>
                <span v-if="s.note" class="slide-note slide-note--slide">{{
                  s.note
                }}</span>
              </div>
              <span v-if="slideNumber(s, i) !== null" class="slide-number"
                >{{ slideNumber(s, i)
                }}<template v-if="!s.isCover"> / {{ contentCount }}</template></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

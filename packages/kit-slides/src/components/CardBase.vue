<script setup lang="ts">
import { computed } from "vue";

export type CardBaseTone = "default" | "primary" | "accent" | "muted" | "dark";
export type CardBaseSize = `${number}x${number}`;

interface Props {
  size?: CardBaseSize;
  colSpan?: number;
  rowSpan?: number;
  tone?: CardBaseTone;
  eyebrow?: string;
  title?: string;
  isRow?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  colSpan: 1,
  rowSpan: 1,
  tone: "default",
  eyebrow: "",
  title: "",
});

const span = computed<{ col: number; row: number }>(() => {
  if (props.size) {
    const [c, r] = props.size.split("x").map((n) => Number.parseInt(n, 10));
    if (Number.isFinite(c) && Number.isFinite(r) && c > 0 && r > 0) {
      return { col: c, row: r };
    }
  }
  return { col: props.colSpan, row: props.rowSpan };
});

const cardStyle = computed(() => ({
  gridColumn: `span ${span.value.col}`,
  gridRow: `span ${span.value.row}`,
}));

const toneClass = computed(() =>
  props.tone === "default" ? null : `bento-card--${props.tone}`,
);
</script>

<template>
  <div class="bento-card" :class="toneClass" :style="cardStyle">
    <div v-if="$slots.header || eyebrow || title" class="bento-card__header">
      <slot name="header">
        <span v-if="eyebrow" class="bento-card__eyebrow">{{ eyebrow }}</span>
        <span v-if="title" class="bento-card__title">{{ title }}</span>
      </slot>
    </div>
    <div v-if="$slots.default" class="bento-card__body" :class="props.isRow ? 'bento-card__body--row' : null">
      <slot />
    </div>
    <div v-if="$slots.footer" class="bento-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

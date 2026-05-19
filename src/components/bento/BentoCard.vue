<script setup lang="ts">
import { computed } from "vue";

/**
 * BentoCard — a generic, slotted card for use inside <BentoSlide>.
 *
 * Sizing:
 *   - `size="2x1"` shorthand (cols × rows) for the common case
 *   - `:col-span` / `:row-span` numeric props as an escape hatch
 *   - `size` wins over col-span/row-span if both are set
 *
 * Tone:
 *   - default | primary | accent | muted | dark — styling hooks for themes
 *
 * Composition:
 *   - `header` slot replaces the built-in eyebrow + title block
 *   - default slot is the body (charts, metrics, lists, free markup)
 *   - `footer` slot for captions / sources
 */

export type BentoTone = "default" | "primary" | "accent" | "muted" | "dark";
export type BentoSize = `${number}x${number}`;

interface Props {
  size?: BentoSize;
  colSpan?: number;
  rowSpan?: number;
  tone?: BentoTone;
  eyebrow?: string;
  title?: string;
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
    <div v-if="$slots.default" class="bento-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="bento-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

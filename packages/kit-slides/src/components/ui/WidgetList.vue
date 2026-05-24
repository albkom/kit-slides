<script setup lang="ts">
export type ListItemTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface ListItem {
  text: string;
  tone?: ListItemTone;
  badge?: string;
}

interface Props {
  items: ListItem[];
}

defineProps<Props>();
</script>

<template>
  <div v-if="!items.length" class="widget-list-empty">Nessun elemento</div>
  <ul v-else class="widget-list">
    <li
      v-for="(item, i) in items"
      :key="i"
      class="wl-item"
      :class="`tone-${item.tone ?? 'neutral'}`"
    >
      <div class="wl-text">{{ item.text }}</div>
      <span v-if="item.badge" class="wl-badge">{{ item.badge }}</span>
    </li>
  </ul>
</template>

<style scoped>
.widget-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
  min-height: 0;
}

.wl-item {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.5rem 0.65rem;
  border-radius: 0.4rem;
  border-left: 3px solid transparent;
}

/* Tones — left border + subtle background */
.tone-neutral { border-left-color: var(--text-secondary, #64748b); background: transparent; }
.tone-info    { border-left-color: var(--brand-primary,   #4f46e5); background: color-mix(in srgb, var(--brand-primary, #4f46e5)  6%, transparent); }
.tone-success { border-left-color: var(--status-ok,       #059669); background: color-mix(in srgb, var(--status-ok,     #059669)  8%, transparent); }
.tone-warning { border-left-color: var(--status-warn,     #d97706); background: color-mix(in srgb, var(--status-warn,   #d97706)  8%, transparent); }
.tone-danger  { border-left-color: var(--status-bad,      #dc2626); background: color-mix(in srgb, var(--status-bad,    #dc2626)  8%, transparent); }

/* Note text — wraps, max 3 lines */
.wl-text {
  flex: 1;
  min-width: 0;
  font-size: var(--txt-s, 0.78rem);
  color: var(--text-primary, #0f172a);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Badge */
.wl-badge {
  flex-shrink: 0;
  align-self: flex-start;
  font-size: var(--txt-xs, 0.65rem);
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: var(--border, rgba(0,0,0,0.08));
  color: var(--text-secondary, #64748b);
  white-space: nowrap;
}

.tone-warning .wl-badge { background: var(--status-warn-bg, #fef3c7); color: var(--status-warn, #d97706); }
.tone-danger  .wl-badge { background: var(--status-bad-bg,  #fee2e2); color: var(--status-bad,  #dc2626); }
.tone-success .wl-badge { background: var(--status-ok-bg,   #d1fae5); color: var(--status-ok,   #059669); }
.tone-info    .wl-badge { background: var(--brand-light,    #eef2ff); color: var(--brand-primary,#4f46e5); }

.widget-list-empty {
  font-size: var(--txt-s);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>

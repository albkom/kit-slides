<script setup lang="ts">
import { BentoSlide, BentoCard, Sparkline, DeltaBadge } from '../../../index'

defineProps<{ columns?: number }>()

const trend = [12, 14, 13, 17, 16, 20, 22, 21, 25, 28, 27, 31]
const usage = [40, 38, 42, 45, 44, 50, 53, 56, 60, 62, 65, 70]

const updates = [
  { label: 'Pipeline ingestion', status: 'OK' },
  { label: 'Auth service',       status: 'OK' },
  { label: 'Billing webhook',    status: 'WARN' },
  { label: 'Report exporter',    status: 'OK' },
]
</script>

<template>
  <BentoSlide
    title="Composizione bento"
    meta="Layout asimmetrico · 4 colonne"
    :columns="columns ?? 4"
  >
    <!-- Hero card 2×2: KPI grosso + sparkline + delta -->
    <BentoCard size="2x2" tone="primary" eyebrow="Revenue" title="€ 184.2K">
      <Sparkline :values="trend" :width="320" :height="120" fill />
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <DeltaBadge :value="12.4" />
        <span style="color: var(--text-secondary); font-size: var(--txt-s);">
          vs. settimana precedente
        </span>
      </div>
    </BentoCard>

    <!-- Tile 1×1 -->
    <BentoCard size="1x1" eyebrow="Utenti attivi" title="12.4K">
      <DeltaBadge :value="3.8" />
    </BentoCard>

    <!-- Tile 1×1 -->
    <BentoCard size="1x1" eyebrow="Conversion" title="3.7%">
      <DeltaBadge :value="-1.2" />
    </BentoCard>

    <!-- Wide 2×1 con sparkline -->
    <BentoCard size="2x1" eyebrow="Utilizzo piattaforma" title="Andamento 12 settimane">
      <Sparkline :values="usage" :width="320" :height="60" :stroke="'var(--brand-accent)'" fill />
    </BentoCard>

    <!-- Tile dark 1×1 con escape hatch numerico (equivalente a size="1x1") -->
    <BentoCard :col-span="1" :row-span="1" tone="dark" eyebrow="SLA" title="99.95%">
      <template #footer>Uptime trimestrale</template>
    </BentoCard>

    <!-- Wide 3×1 con lista -->
    <BentoCard size="3x1" tone="muted" eyebrow="Stato servizi" title="Health check">
      <ul style="margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.35rem 1rem;">
        <li v-for="u in updates" :key="u.label" style="display: flex; justify-content: space-between; gap: 0.5rem; font-size: var(--txt-s);">
          <span>{{ u.label }}</span>
          <span :style="{
            color: u.status === 'OK' ? 'var(--status-ok)' : 'var(--status-warn)',
            fontWeight: 600,
          }">{{ u.status }}</span>
        </li>
      </ul>
    </BentoCard>
  </BentoSlide>
</template>

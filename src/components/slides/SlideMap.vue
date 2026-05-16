<script setup>
import { computed, ref } from 'vue'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import worldData from 'world-atlas/countries-110m.json'
import { alpha2ToNumeric, numericToAlpha2, countryNames } from '../../data/countryData.js'

const props = defineProps({
  geoData: { type: Array, default: () => [] },
  week: { type: Number, required: true },
  year: { type: Number, required: true },
})

// ── Continent sets (alpha-2) ───────────────────────────────────────────────────
const CONTINENT = {
  EU: new Set(['AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','XK','LV','LI','LT','LU','MT','MD','MC','ME','NL','MK','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB','VA']),
  NA: new Set(['AG','BS','BB','BZ','CA','CR','CU','DM','DO','SV','GD','GT','HT','HN','JM','MX','NI','PA','KN','LC','VC','TT','US']),
  SA: new Set(['AR','BO','BR','CL','CO','EC','GY','PY','PE','SR','UY','VE']),
  AF: new Set(['DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ','NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','SZ','TZ','TG','TN','UG','ZM','ZW']),
  // Asia + Oceania merged
  AO: new Set(['AF','AM','AZ','BH','BD','BT','BN','KH','CN','GE','IN','ID','IR','IQ','IL','JP','JO','KZ','KW','KG','LA','LB','MY','MV','MN','MM','NP','KP','OM','PK','PS','PH','QA','SA','SG','LK','SY','TW','TJ','TH','TL','TR','TM','AE','UZ','VN','YE','AU','FJ','KI','MH','FM','NR','NZ','PW','PG','WS','SB','TO','TV','VU']),
}

const PANELS = [
  { key: 'EU', label: 'Europa',         area: 'eu', maxItems: 8 },
  { key: 'NA', label: 'Nord America',   area: 'na', maxItems: 4 },
  { key: 'SA', label: 'Sud America',    area: 'sa', maxItems: 4 },
  { key: 'AF', label: 'Africa',         area: 'af', maxItems: 4 },
  { key: 'AO', label: 'Asia & Oceania', area: 'ao', maxItems: 6 },
]

// ── Chart data ────────────────────────────────────────────────────────────────
const panels = computed(() => {
  const buckets = Object.fromEntries(PANELS.map((p) => [p.key, []]))
  for (const d of props.geoData) {
    for (const [cont, codes] of Object.entries(CONTINENT)) {
      if (codes.has(d.code)) { buckets[cont].push(d); break }
    }
  }
  return PANELS.map((p) => {
    const items = buckets[p.key].sort((a, b) => b.value - a.value).slice(0, p.maxItems)
    const total = buckets[p.key].reduce((s, d) => s + d.value, 0)
    return { ...p, items, total, max: items[0]?.value || 1 }
  })
})

// ── Map geometry (computed once at module level) ────────────────────────────────
const EU_W = 820, WORLD_W = 340, MAP_H = 300

const EU_BBOX = {
  type: 'Feature',
  geometry: { type: 'Polygon', coordinates: [[[-12, 34], [42, 34], [42, 71], [-12, 71], [-12, 34]]] },
}

const worldFeatures = feature(worldData, worldData.objects.countries)

const euProjection  = geoNaturalEarth1().fitSize([EU_W, MAP_H], EU_BBOX)
const worldProjection = geoNaturalEarth1().fitSize([WORLD_W, MAP_H], worldFeatures)
const euPathGen     = geoPath(euProjection)
const worldPathGen  = geoPath(worldProjection)

const euBasePaths    = worldFeatures.features.map((f) => ({ id: f.id, d: euPathGen(f) })).filter((p) => p.d)
const worldBasePaths = worldFeatures.features.map((f) => ({ id: f.id, d: worldPathGen(f) })).filter((p) => p.d)
const euBboxOutline  = worldPathGen(EU_BBOX)

// ── Map color scale ────────────────────────────────────────────────────────────
function lerpColor(t) {
  return `rgb(${Math.round(230 + (12 - 230) * t)},${Math.round(241 + (68 - 241) * t)},${Math.round(251 + (124 - 251) * t)})`
}

const valueMap = computed(() => {
  const m = new Map()
  for (const d of props.geoData) {
    const n = alpha2ToNumeric[d.code]
    if (n != null) m.set(String(n), d.value)
  }
  return m
})

const extent = computed(() => {
  const vals = props.geoData.map((d) => d.value)
  return vals.length ? { min: Math.min(...vals), max: Math.max(...vals) } : { min: 0, max: 1 }
})

function fillFor(id) {
  const { min, max } = extent.value
  const val = valueMap.value.get(String(id))
  return val != null ? lerpColor((val - min) / (max - min || 1)) : '#ccd8e2'
}

const euPaths    = computed(() => euBasePaths.map((p)    => ({ ...p, fill: fillFor(p.id), value: valueMap.value.get(String(p.id)) ?? null })))
const worldPaths = computed(() => worldBasePaths.map((p) => ({ ...p, fill: fillFor(p.id), value: valueMap.value.get(String(p.id)) ?? null })))

// ── Formatting ────────────────────────────────────────────────────────────────
const eur    = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const numFmt = new Intl.NumberFormat('it-IT')

function compact(v) {
  if (v >= 1_000_000) return '€' + (v / 1_000_000).toFixed(1).replace('.', ',') + 'M'
  if (v >= 1_000)     return '€' + Math.round(v / 1_000) + 'K'
  return '€' + Math.round(v)
}
function trunc(name, max) {
  if (!name) return '—'
  return name.length > max ? name.slice(0, max - 1) + '…' : name
}

// ── Map tooltip ───────────────────────────────────────────────────────────────
const mapRef = ref(null)
const tooltip = ref({ visible: false, x: 0, y: 0, name: '', value: '' })

function showTooltip(p, e) {
  const rect = mapRef.value?.getBoundingClientRect()
  const a2 = numericToAlpha2[String(p.id)]
  tooltip.value = {
    visible: true,
    x: e.clientX - (rect?.left ?? 0),
    y: e.clientY - (rect?.top ?? 0),
    name: (a2 && countryNames[a2]) ?? '—',
    value: p.value != null ? eur.format(p.value) : '(nessun dato)',
  }
}
function moveTooltip(e) {
  if (!tooltip.value.visible) return
  const rect = mapRef.value?.getBoundingClientRect()
  tooltip.value.x = e.clientX - (rect?.left ?? 0)
  tooltip.value.y = e.clientY - (rect?.top ?? 0)
}
function hideTooltip() { tooltip.value.visible = false }
</script>

<template>
  <div class="slide slide-map">

    <div class="slide-header">
      <h2 class="slide-title">Performance Geografica</h2>
      <span class="slide-meta">W{{ week }} · {{ year }}</span>
    </div>

    
    <!-- ── World map ────────────────────────────────────────────────────────── -->
    <div ref="mapRef" class="map-section" @mousemove="moveTooltip" @mouseleave="hideTooltip">
      <!-- Europe (large) -->
      <svg class="map-eu" :viewBox="`0 0 ${EU_W} ${MAP_H}`" preserveAspectRatio="xMidYMid meet">
        <path
          v-for="p in euPaths" :key="p.id"
          :d="p.d" :fill="p.fill"
          stroke="white" stroke-width="0.6"
          @mouseenter="showTooltip(p, $event)"
        />
      </svg>

      <!-- Tooltip -->
      <div v-if="tooltip.visible" class="tooltip"
        :style="{ left: tooltip.x + 14 + 'px', top: tooltip.y - 52 + 'px' }">
        <span class="tt-name">{{ tooltip.name }}</span>
        <span class="tt-value">{{ tooltip.value }}</span>
      </div>
    </div>

    <!-- ── Charts by continent ──────────────────────────────────────────────── -->
    <div class="charts-grid">
      <div
        v-for="panel in panels"
        :key="panel.key"
        class="cont-panel"
        :class="`cont-${panel.area}`"
      >
        <div class="panel-head">
          <span class="panel-name">{{ panel.label }}</span>
          <span v-if="panel.total > 0" class="panel-total">{{ compact(panel.total) }}</span>
        </div>
        <div v-if="panel.items.length === 0" class="no-data">nessun dato</div>
        <div v-else class="bar-list">
          <div v-for="item in panel.items" :key="item.code" class="bar-row">
            <span class="bar-label">
              {{ trunc(countryNames[item.code] ?? item.code, panel.key === 'EU' ? 14 : 11) }}
            </span>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: (item.value / panel.max) * 100 + '%' }" />
            </div>
            <span class="bar-value">{{ compact(item.value) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <span class="legend-label">{{ geoData.length ? numFmt.format(extent.min) : '' }}</span>
      <div class="legend-bar" />
      <span class="legend-label end">{{ geoData.length ? numFmt.format(extent.max) : '' }}</span>
    </div>

  </div>
</template>

<style scoped>
.slide-map {
  background: var(--surface);
  display: flex;
  flex-direction: row;
  padding: var(--slide-padding);
  gap: 0.6rem;
  height: 100%;
}

.slide-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-shrink: 0;
}
.slide-title { font-size: 1.6rem; font-weight: 700; color: var(--brand-dark); }
.slide-meta  { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }

/* ── Charts grid ─────────────────────────────────────────────────────────────── */
.charts-grid {
  flex: 0 0 210px;
  display: grid;
  grid-template-columns: 1fr 2.2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    "na eu ao"
    "sa eu ao"
    "af eu ao";
  gap: 0.45rem;
}

.cont-na { grid-area: na; }
.cont-eu { grid-area: eu; }
.cont-ao { grid-area: ao; }
.cont-sa { grid-area: sa; }
.cont-af { grid-area: af; }

.cont-panel {
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
  min-height: 0;
}

.cont-eu {
  background: var(--brand-light);
  border: 2px solid var(--brand-primary);
  padding: 0.65rem 1rem;
  gap: 0.35rem;
}

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-shrink: 0;
}
.panel-name {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}
.cont-eu .panel-name { font-size: 0.75rem; color: var(--brand-dark); }

.panel-total { font-size: 0.62rem; font-weight: 600; color: var(--brand-primary); }
.cont-eu .panel-total { font-size: 0.82rem; }

.bar-list {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.bar-label {
  flex: 0 0 62px;
  font-size: 0.58rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cont-eu .bar-label { flex: 0 0 88px; font-size: 0.72rem; color: var(--text-primary); }
.cont-ao .bar-label { flex: 0 0 68px; }

.bar-track {
  flex: 1;
  height: 6px;
  background: rgba(0,0,0,0.08);
  border-radius: 3px;
  overflow: hidden;
}
.cont-eu .bar-track { height: 10px; }

.bar-fill {
  height: 100%;
  background: var(--brand-primary);
  border-radius: 3px;
}

.bar-value {
  flex: 0 0 36px;
  font-size: 0.56rem;
  color: var(--text-secondary);
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.cont-eu .bar-value { flex: 0 0 48px; font-size: 0.7rem; }

.no-data {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: var(--border);
  font-style: italic;
}

/* ── World map ───────────────────────────────────────────────────────────────── */
.map-section {
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  border-radius: 8px;
  background: white;
  border: 1px solid var(--border);
  padding: 0.4rem;
  gap: 0;
}

.map-eu {
  flex: 1;
  display: block;
  height: 100%;
  min-width: 0;
}

.map-divider {
  flex-shrink: 0;
  width: 1px;
  background: var(--border);
  margin: 0 8px;
  align-self: stretch;
}

.map-world {
  flex: 0 0 27%;
  display: block;
  height: 100%;
}

.tooltip {
  position: absolute;
  pointer-events: none;
  background: white;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  z-index: 10;
}
.tt-name  { font-size: 0.75rem; font-weight: 700; color: var(--text-primary); }
.tt-value { font-size: 0.72rem; color: var(--brand-primary); font-variant-numeric: tabular-nums; }

/* ── Legend ──────────────────────────────────────────────────────────────────── */
.legend {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 18px;
}
.legend-bar {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #e6f1fb, #0c447c);
}
.legend-label {
  font-size: 0.68rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 36px;
}
.legend-label.end { text-align: right; }
</style>

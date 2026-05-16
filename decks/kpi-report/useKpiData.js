import { ref, computed } from "vue";

function toNum(v) {
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function delta(current, prev) {
  if (!prev || prev === 0) return null;
  return ((current - prev) / Math.abs(prev)) * 100;
}

export function useKpiData(adapter) {
  const isLoading = ref(true);
  const error = ref(null);

  const _summary = ref([]);
  const _channels = ref([]);
  const _categories = ref([]);
  const _geo = ref([]);

  const currentWeek = computed(() => {
    if (!_summary.value.length) return null;
    const maxYear = Math.max(..._summary.value.map((r) => Number(r.year)));
    const inYear = _summary.value.filter((r) => Number(r.year) === maxYear);
    const maxWeek = Math.max(...inYear.map((r) => Number(r.week)));
    return { week: maxWeek, year: maxYear };
  });

  const summary = computed(() => {
    if (!currentWeek.value || !_summary.value.length) return null;
    const row = _summary.value.find(
      (r) =>
        Number(r.week) === currentWeek.value.week &&
        Number(r.year) === currentWeek.value.year,
    );
    if (!row) return null;

    const fatturato = toNum(row.fatturato);
    const fatturato_prev = toNum(row.fatturato_prev);
    const ordini = toNum(row.ordini);
    const ordini_prev = toNum(row.ordini_prev);
    const tasso_conversione = toNum(row.tasso_conversione);
    const tasso_conversione_prev = toNum(row.tasso_conversione_prev);
    const ticket_medio = toNum(row.ticket_medio);
    const ticket_medio_prev = toNum(row.ticket_medio_prev);

    return {
      fatturato,
      fatturato_delta: delta(fatturato, fatturato_prev),
      ordini,
      ordini_delta: delta(ordini, ordini_prev),
      tasso_conversione,
      tasso_conversione_delta: delta(tasso_conversione, tasso_conversione_prev),
      ticket_medio,
      ticket_medio_delta: delta(ticket_medio, ticket_medio_prev),
    };
  });

  const channels = computed(() => {
    if (!currentWeek.value) return [];
    return _channels.value
      .map((r) => ({
        name: r.name,
        total: toNum(r.total),
        oks: toNum(r.oks),
        kos: toNum(r.kos),
        draws: toNum(r.draws),
        kpi_1: toNum(r.kpi_1),
        kpi_2: toNum(r.kpi_2),
        kpi_3: toNum(r.kpi_3),
      }))
      .sort((a, b) => b.oks - a.oks);
  });

  const categories = computed(() => {
    if (!currentWeek.value) return [];
    return _categories.value
      .filter(
        (r) =>
          Number(r.week) === currentWeek.value.week &&
          Number(r.year) === currentWeek.value.year,
      )
      .map((r) => {
        const fatturato = toNum(r.fatturato);
        const fatturato_prev = toNum(r.fatturato_prev);
        const ordini = toNum(r.ordini);
        const ordini_prev = toNum(r.ordini_prev);
        return {
          name: r.name,
          fatturato,
          ordini,
          fatturato_delta: delta(fatturato, fatturato_prev),
          target_fatturato: toNum(r.target_fatturato),
          stato: r.stato || "in_target",
        };
      })
      .sort((a, b) => b.fatturato - a.fatturato);
  });

  const geoData = computed(() => {
    if (!currentWeek.value) return [];
    return _geo.value
      .filter(
        (r) =>
          Number(r.week) === currentWeek.value.week &&
          Number(r.year) === currentWeek.value.year,
      )
      .map((r) => ({
        code: r.code.trim().toUpperCase(),
        value: toNum(r.value),
      }));
  });

  async function load() {
    try {
      isLoading.value = true;
      error.value = null;
      const [summary, channels, categories, geo] = await Promise.all([
        adapter.fetchSummary(),
        adapter.fetchChannels(),
        adapter.fetchCategories(),
        adapter.fetchGeo(),
      ]);
      _summary.value = summary;
      _channels.value = channels;
      _categories.value = categories;
      _geo.value = geo ?? [];
    } catch (e) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  }

  load();

  return {
    currentWeek,
    summary,
    channels,
    categories,
    geoData,
    isLoading,
    error,
  };
}

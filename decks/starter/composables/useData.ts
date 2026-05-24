import { ref } from "vue";
import type { Ref } from "vue";
import type {
  IKpiAdapter,
  AreaRow,
  PerformanceRow,
  GeoRow,
  ResultsDistributionRow,
} from "../types";
import { setData } from "./useDashboardStore";

function validateRows<T extends object>(
  source: string,
  rows: readonly T[],
  required: readonly (keyof T)[],
): void {
  rows.forEach((row, idx) => {
    for (const field of required) {
      const v = row[field];
      if (v === undefined || v === null || String(v).trim() === "") {
        throw new Error(
          `${source}: campo "${String(field)}" mancante o vuoto alla riga ${idx + 1}`,
        );
      }
    }
  });
}

export interface UseDataResult {
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
}

export function useData(adapter: IKpiAdapter): UseDataResult {
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  async function load() {
    try {
      isLoading.value = true;
      error.value = null;
      const [areas, channels, perf, geo, rDist] = await Promise.all([
        adapter.fetchAreas(),
        adapter.fetchChannels(),
        adapter.fetchPerformance(),
        adapter.fetchGeo(),
        adapter.fetchResultsDistribution(),
      ]);

      validateRows<AreaRow>("kpi_areas", areas, [
        "week",
        "area",
        "ops",
        "kpi_1",
        "kpi_2",
        "kpi_3",
        "ops_win",
        "ops_loss",
        "ops_draw",
      ]);
      validateRows<PerformanceRow>("performance", perf, [
        "week",
        "name",
        "tot",
        "oks",
        "kos",
        "draws",
      ]);
      if (geo) {
        validateRows<GeoRow>("geo", geo, ["week", "year", "code", "value"]);
      }
      if (rDist) {
        validateRows<ResultsDistributionRow>(
          "resultsDistribution",
          rDist,
          ["name", "code", "ops"],
        );
      } else {
        console.warn("Results distribution data not available");
      }

      setData({
        areas,
        channels,
        performance: perf,
        geo: geo ?? [],
        resultsDistribution: rDist ?? [],
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      isLoading.value = false;
    }
  }

  load();

  return { isLoading, error };
}

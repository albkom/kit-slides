import { computed } from "vue";
import type { ComputedRef } from "vue";
import type { PieItem, RadarItem } from "kit-slides";
import { performance, resultsDistribution } from "./useDashboardStore";

export interface UseTargetServerResult {
  pieData: ComputedRef<PieItem[]>;
  radarAxes: ComputedRef<string[]>;
  radarData: ComputedRef<RadarItem[]>;
  knownIssues: ComputedRef<{ text: string; tone: string; badge: string }[]>;
}

function getResultDescription(code: string): string {
  switch (code) {
    case "200":
      return "OK";
    case "400":
      return "Bad Request";
    case "401":
      return "Unauthorized";
    case "403":
      return "Forbidden";
    case "404":
      return "Not Found";
    case "429":
      return "Too Many Requests";
    case "500":
      return "Internal Server Error";
    case "502":
      return "Bad Gateway";
    case "503":
      return "Service Unavailable";
    case "504":
      return "Gateway Timeout";
    default:
      return `Code ${code}`;
  }
}

export function useTargetServer(serverName: string): UseTargetServerResult {
  const grouped = new Map<string, number>();
  resultsDistribution.value?.forEach((item) => {
    const current = grouped.get(item.code) ?? 0;
    grouped.set(item.code, current + item.ops);
  });
  const groupedArray = Array.from(grouped.entries())
    .map(([code, ops]) => ({ code, ops }))
    .sort((a, b) => b.ops - a.ops)
    .slice(0, 4)
    .concat(
      Array.from(grouped.entries())
        .map(([code, ops]) => ({ code, ops }))
        .sort((a, b) => b.ops - a.ops)
        .slice(4)
        .reduce((acc, item) => acc + item.ops, 0) > 0
        ? [
            {
              code: "Other",
              ops: Array.from(grouped.entries())
                .map(([_, ops]) => ops)
                .sort((a, b) => b - a)
                .slice(4)
                .reduce((acc, ops) => acc + ops, 0),
            },
          ]
        : [],
    );

  const PIE_COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#F44336", "#9E9E9E"];

  const pieData = computed<PieItem[]>(() =>
    groupedArray.map((a, i) => ({
      label: `${a.code} | ${getResultDescription(a.code)}`,
      value: a.ops,
      color: PIE_COLORS[i % PIE_COLORS.length],
    })),
  );

  const radarAxes = computed<string[]>(() =>
    performance.value
      .filter((p) => p.name === serverName)
      .map((p) => ["KPI 1", "KPI 2", "KPI 3"])
      .flat(),
  );

  const radarData = computed(() => {
    const perf = performance.value.find((p) => p.name === serverName);
    if (!perf) return [];
    return [
      {
        label: "KPI 1",
        values: [perf.kpi_1 * 100, perf.kpi_2 * 100, perf.kpi_3 * 100],
        color: "#4CAF50",
      },
    ];
  });

  const knownIssues = computed(() => {
    const issues = [];
    issues.push(
      {
        text: generateRandomPhrase(50),
        tone: "danger",
        badge: "Open",
      },
      {
        text: generateRandomPhrase(50),
        tone: "warning",
        badge: "Monitoring",
      },
    );
    return issues;
  });

  return { pieData, radarAxes, radarData, knownIssues };
}

function generateRandomPhrase(numWords: number): string {
  const words = [
    "auth",
    "cache",
    "database",
    "timeout",
    "error",
    "spike",
    "latency",
    "failure",
    "service",
    "dependency",
    "issue",
    "monitoring",
    "alert",
    "response",
    "code",
  ];
  let phrase = "";
  for (let i = 0; i < numWords; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    phrase += words[randomIndex] + " ";
  }
  return phrase.trim();
}

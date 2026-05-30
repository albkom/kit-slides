import Papa from 'papaparse'

export type Row = Record<string, string>

export async function loadCsv(path: string): Promise<Row[]> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Cannot load ${path}: ${res.status}`)
  const text = await res.text()
  return Papa.parse<Row>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v: string) => v.trim(),
  }).data
}

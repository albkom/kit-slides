import Papa from 'papaparse'

function parse<T>(file: string, text: string): T[] {
  const result = Papa.parse<T>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
    transform: (v: string) => v.trim(),
  })
  if (result.errors.length) {
    throw new Error(`Errore nel parsing di "${file}": ${result.errors[0].message}`)
  }
  return result.data
}

export async function loadCsv<T>(file: string): Promise<T[]> {
  const res = await fetch(file)
  if (!res.ok) throw new Error(`Impossibile caricare "${file}": ${res.status}`)
  const text = await res.text()
  return parse<T>(file, text)
}

export async function loadCsvOptional<T>(file: string): Promise<T[] | null> {
  const res = await fetch(file)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Impossibile caricare "${file}": ${res.status}`)
  const text = await res.text()
  return parse<T>(file, text)
}

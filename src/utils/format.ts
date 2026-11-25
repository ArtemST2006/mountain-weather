/** −12° / 5° (настоящий минус, а не дефис). */
export function formatTemp(value: number): string {
  return `${value < 0 ? '−' : ''}${Math.abs(value)}°`
}

/** 8 849 */
export function formatNumber(value: number): string {
  return value.toLocaleString('ru-RU')
}

/** pluralize(5, ['вершина', 'вершины', 'вершин']) → «5 вершин» */
export function pluralize(n: number, [one, few, many]: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${few}`
  return `${n} ${many}`
}

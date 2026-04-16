/**
 * Pure utility functions extracted for testability and reuse.
 */

/** Format a number as CNY price string: ¥1,234 */
export const formatPrice = (n: number): string => '\u00a5' + n.toLocaleString()

/** Format date string (YYYY-MM-DD) to Chinese format: 2024年1月15日 */
export function formatDateCN(s: string): string {
  if (!s) return ''
  const d = new Date(s)
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
}

const wkCN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

/** Get Chinese weekday label for a date string */
export function getWeekdayCN(s: string): string {
  return wkCN[new Date(s).getDay()]
}

/** Parse duration string like "12h40m" to total minutes */
export function parseDurationMinutes(d: string): number {
  const hm = d.match(/(\d+)h(\d+)m/)
  if (hm) return parseInt(hm[1]) * 60 + parseInt(hm[2])
  const hOnly = d.match(/(\d+)h/)
  if (hOnly) return parseInt(hOnly[1]) * 60
  const mOnly = d.match(/(\d+)m/)
  if (mOnly) return parseInt(mOnly[1])
  return 0
}

/** Get total flight duration in minutes for a flight offer (sum of all segments) */
export function getTotalDurationMinutes(segments: { duration: string }[]): number {
  return segments.reduce((sum, s) => sum + parseDurationMinutes(s.duration), 0)
}



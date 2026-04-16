import { useState, useEffect } from 'react'
import type { SearchParams, SearchHistoryItem } from '../types/flight'

const SEARCH_HISTORY_KEY = 'flight_search_history'
const MAX_HISTORY_COUNT = 10 // 最多保存10条搜索历史

// 生成搜索历史的描述文本
function generateSearchDescription(params: SearchParams): string {
  const tripTypeText = params.tripType === 'oneway' ? '单程' : '往返'
  const routeText = `${params.from.name} → ${params.to.name}`
  const dateText = params.tripType === 'roundtrip' 
    ? `${params.departDate} / ${params.returnDate}` 
    : params.departDate
  
  let filterText = ''
  if (params.filters) {
    const filters = []
    if (params.filters.airlines.length > 0) {
      filters.push(`${params.filters.airlines.length}家航空公司`)
    }
    if (params.filters.priceRange[0] > 0 || params.filters.priceRange[1] < 10000) {
      filters.push(`¥${params.filters.priceRange[0]}-¥${params.filters.priceRange[1]}`)
    }
    if (params.filters.onlyDirect) {
      filters.push('仅直飞')
    }
    if (filters.length > 0) {
      filterText = ` (${filters.join('，')})`
    }
  }

  return `${tripTypeText} ${routeText} ${dateText}${filterText}`
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  // 从localStorage加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse search history:', e)
      }
    }
  }, [])

  // 保存搜索历史到localStorage
  const saveHistory = (items: SearchHistoryItem[]) => {
    setHistory(items)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items))
  }

  // 添加搜索历史
  const addSearchHistory = (params: SearchParams) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      params,
      timestamp: Date.now(),
      description: generateSearchDescription(params)
    }

    // 使用函数式更新确保获取最新的history状态，避免闭包陷阱
    setHistory(prevHistory => {
      // 去重：如果存在相同的搜索条件，删除旧的
      const filteredHistory = prevHistory.filter(item => 
        JSON.stringify(item.params) !== JSON.stringify(params)
      )

      // 新历史放在最前面，最多保留MAX_HISTORY_COUNT条
      const newHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_COUNT)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  // 删除单条搜索历史
  const deleteSearchHistory = (id: string) => {
    setHistory(prevHistory => {
      const newHistory = prevHistory.filter(item => item.id !== id)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  // 清空所有搜索历史
  const clearSearchHistory = () => {
    setHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }

  return {
    history,
    addSearchHistory,
    deleteSearchHistory,
    clearSearchHistory
  }
}

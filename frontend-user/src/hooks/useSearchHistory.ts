import { useState, useEffect, useCallback } from 'react'
import type { SearchParams, SearchHistoryItem } from '../types/flight'

/** localStorage 中搜索历史的存储键名 */
const SEARCH_HISTORY_KEY = 'flight_search_history'
/** 最多保存的搜索历史记录数量 */
const MAX_HISTORY_ITEMS = 10

/**
 * 生成搜索历史的显示标签
 * @param params - 搜索参数
 * @returns 格式化的搜索标签字符串
 */
function generateSearchLabel(params: SearchParams): string {
  const tripType = params.tripType === 'oneway' ? '单程' : '往返'
  const route = `${params.from.code} → ${params.to.code}`
  const date = params.departDate
  return `${tripType} ${route} ${date}`
}

/**
 * 生成唯一ID
 * 使用时间戳和随机数生成唯一标识符
 * @returns 唯一ID字符串
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 搜索历史管理自定义Hook
 * 提供搜索历史的添加、删除、清空功能
 * 使用 localStorage 实现数据持久化
 * @returns 历史记录列表和操作方法
 */
export function useSearchHistory() {
  /** 搜索历史列表状态 */
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  /**
   * 组件挂载时从 localStorage 加载搜索历史
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load search history:', e)
    }
  }, [])

  /**
   * 保存搜索历史到 localStorage
   * @param items - 要保存的历史记录列表
   */
  const saveHistory = useCallback((items: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items))
      setHistory(items)
    } catch (e) {
      console.error('Failed to save search history:', e)
    }
  }, [])

  /**
   * 添加搜索记录到历史
   * 自动去重相同航线、日期、行程类型的记录
   * 最多保存 MAX_HISTORY_ITEMS 条记录
   * @param params - 搜索参数
   */
  const addToHistory = useCallback((params: SearchParams) => {
    const newItem: SearchHistoryItem = {
      id: generateId(),
      params,
      searchTime: new Date().toISOString(),
      label: generateSearchLabel(params),
    }

    setHistory((prev) => {
      const filtered = prev.filter(
        (item) =>
          !(
            item.params.from.code === params.from.code &&
            item.params.to.code === params.to.code &&
            item.params.departDate === params.departDate &&
            item.params.tripType === params.tripType
          )
      )
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      saveHistory(updated)
      return updated
    })
  }, [saveHistory])

  /**
   * 删除指定的搜索历史记录
   * @param id - 要删除的记录ID
   */
  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      saveHistory(updated)
      return updated
    })
  }, [saveHistory])

  /**
   * 清空所有搜索历史记录
   */
  const clearHistory = useCallback(() => {
    saveHistory([])
  }, [saveHistory])

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}

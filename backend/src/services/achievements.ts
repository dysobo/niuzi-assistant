import Record from '../models/Record'
import dayjs from 'dayjs'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
}

export class AchievementsService {
  /**
   * 计算用户的所有成就
   */
  static async calculateAchievements(userId: number): Promise<Achievement[]> {
    const records = await Record.findAll({
      where: { user_id: userId },
      order: [['start_time', 'ASC']]
    })

    // 获取统计数据
    const stats = this.calculateStats(records)

    return [
      // 基础成就 - 首次打卡
      this.checkFirstRecord(records),
      
      // 连续打卡成就
      this.checkThreeDays(stats),
      this.checkSevenDays(stats),
      this.checkFifteenDays(stats),
      this.checkThirtyDays(stats),
      this.checkSixtyDays(stats),
      this.checkHundredDays(stats),
      
      // 累计次数成就
      this.checkTenTimes(stats),
      this.checkFiftyTimes(stats),
      this.checkHundredTimes(stats),
      this.checkFiveHundredTimes(stats),
      this.checkThousandTimes(stats),
      
      // 单日最高成就
      this.checkFiveTimesADay(records),
      this.checkTenTimesADay(records),
      this.checkTwentyTimesADay(records),
      
      // 单次时长成就
      this.checkOneHour(stats),
      this.checkThreeHours(stats),
      this.checkFiveHours(stats),
      
      // 总时长成就
      this.checkTenHours(stats),
      this.checkTwentyFourHours(stats),
      this.checkOneHundredHours(stats),
      
      // 总天数成就
      this.checkSevenDaysTotal(stats),
      this.checkThirtyDaysTotal(stats),
      this.checkHundredDaysTotal(stats),
    ]
  }

  /**
   * 计算统计信息
   */
  private static calculateStats(records: any[]) {
    const totalRecords = records.length
    const dates = new Set<string>()

    records.forEach(record => {
      const date = dayjs(record.start_time).format('YYYY-MM-DD')
      dates.add(date)
    })

    // 计算连续打卡天数
    let maxConsecutive = 0
    let currentConsecutive = 0
    const sortedDates = Array.from(dates).sort()

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        currentConsecutive = 1
      } else {
        const prevDate = dayjs(sortedDates[i - 1])
        const currentDate = dayjs(sortedDates[i])
        if (currentDate.diff(prevDate, 'day') === 1) {
          currentConsecutive++
        } else {
          currentConsecutive = 1
        }
      }
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
    }

    // 计算单日最多记录数
    const dailyCounts = new Map<string, number>()
    records.forEach(record => {
      const date = dayjs(record.start_time).format('YYYY-MM-DD')
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
    })
    const dailyValues = Array.from(dailyCounts.values())
    const maxDailyRecords = dailyValues.length > 0 ? Math.max(...dailyValues) : 0

    // 计算单次最长时间（秒）
    const maxDuration = records
      .filter(r => r.duration)
      .reduce((max, r) => Math.max(max, r.duration || 0), 0)

    // 计算总时长（秒）
    const totalDuration = records
      .filter(r => r.duration)
      .reduce((sum, r) => sum + (r.duration || 0), 0)

    return {
      totalRecords,
      totalDays: dates.size,
      consecutiveDays: maxConsecutive,
      maxDailyRecords,
      maxDuration,
      totalDuration
    }
  }

  // ========== 基础成就 ==========
  private static checkFirstRecord(records: any[]): Achievement {
    const unlocked = records.length > 0
    return {
      id: 'first_record',
      name: '新手上路',
      description: '完成首次打卡',
      icon: '🏆',
      unlocked,
      progress: records.length > 0 ? 1 : 0,
      target: 1
    }
  }

  // ========== 连续打卡成就 ==========
  private static checkThreeDays(stats: any): Achievement {
    const unlocked = stats.consecutiveDays >= 3
    return {
      id: 'three_days',
      name: '初显毅力',
      description: '连续打卡3天',
      icon: '✨',
      unlocked,
      progress: Math.min(stats.consecutiveDays, 3),
      target: 3
    }
  }

  private static checkSevenDays(stats: any): Achievement {
    const unlocked = stats.consecutiveDays >= 7
    return {
      id: 'seven_days',
      name: '一周坚持',
      description: '连续打卡7天',
      icon: '🔥',
      unlocked,
      progress: Math.min(stats.consecutiveDays, 7),
      target: 7
    }
  }

  private static checkFifteenDays(stats: any): Achievement {
    const unlocked = stats.consecutiveDays >= 15
    return {
      id: 'fifteen_days',
      name: '半月不懈',
      description: '连续打卡15天',
      icon: '💪',
      unlocked,
      progress: Math.min(stats.consecutiveDays, 15),
      target: 15
    }
  }

  private static checkThirtyDays(stats: any): Achievement {
    const unlocked = stats.consecutiveDays >= 30
    return {
      id: 'thirty_days',
      name: '满月之约',
      description: '连续打卡30天',
      icon: '🌟',
      unlocked,
      progress: Math.min(stats.consecutiveDays, 30),
      target: 30
    }
  }

  private static checkSixtyDays(stats: any): Achievement {
    const unlocked = stats.consecutiveDays >= 60
    return {
      id: 'sixty_days',
      name: '双月传奇',
      description: '连续打卡60天',
      icon: '👑',
      unlocked,
      progress: Math.min(stats.consecutiveDays, 60),
      target: 60
    }
  }

  private static checkHundredDays(stats: any): Achievement {
    const unlocked = stats.consecutiveDays >= 100
    return {
      id: 'hundred_days',
      name: '百日大师',
      description: '连续打卡100天',
      icon: '🎖️',
      unlocked,
      progress: Math.min(stats.consecutiveDays, 100),
      target: 100
    }
  }

  // ========== 累计次数成就 ==========
  private static checkTenTimes(stats: any): Achievement {
    const unlocked = stats.totalRecords >= 10
    return {
      id: 'ten_times_total',
      name: '初出茅庐',
      description: '累计打卡10次',
      icon: '📝',
      unlocked,
      progress: Math.min(stats.totalRecords, 10),
      target: 10
    }
  }

  private static checkFiftyTimes(stats: any): Achievement {
    const unlocked = stats.totalRecords >= 50
    return {
      id: 'fifty_times',
      name: '坚持不懈',
      description: '累计打卡50次',
      icon: '📊',
      unlocked,
      progress: Math.min(stats.totalRecords, 50),
      target: 50
    }
  }

  private static checkHundredTimes(stats: any): Achievement {
    const unlocked = stats.totalRecords >= 100
    return {
      id: 'hundred_times',
      name: '百次达人',
      description: '累计打卡100次',
      icon: '🏅',
      unlocked,
      progress: Math.min(stats.totalRecords, 100),
      target: 100
    }
  }

  private static checkFiveHundredTimes(stats: any): Achievement {
    const unlocked = stats.totalRecords >= 500
    return {
      id: 'five_hundred_times',
      name: '打卡狂魔',
      description: '累计打卡500次',
      icon: '🤖',
      unlocked,
      progress: Math.min(stats.totalRecords, 500),
      target: 500
    }
  }

  private static checkThousandTimes(stats: any): Achievement {
    const unlocked = stats.totalRecords >= 1000
    return {
      id: 'thousand_times',
      name: '千次传说',
      description: '累计打卡1000次',
      icon: '👽',
      unlocked,
      progress: Math.min(stats.totalRecords, 1000),
      target: 1000
    }
  }

  // ========== 单日最高成就 ==========
  private static checkFiveTimesADay(records: any[]): Achievement {
    const dailyCounts = new Map<string, number>()
    records.forEach(record => {
      const date = dayjs(record.start_time).format('YYYY-MM-DD')
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
    })
    const dailyValues = Array.from(dailyCounts.values())
    const maxDaily = dailyValues.length > 0 ? Math.max(...dailyValues) : 0
    const unlocked = maxDaily >= 5
    return {
      id: 'five_times_a_day',
      name: '一日五次',
      description: '单日打卡5次',
      icon: '⚡',
      unlocked,
      progress: Math.min(maxDaily, 5),
      target: 5
    }
  }

  private static checkTenTimesADay(records: any[]): Achievement {
    const dailyCounts = new Map<string, number>()
    records.forEach(record => {
      const date = dayjs(record.start_time).format('YYYY-MM-DD')
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
    })
    const dailyValues = Array.from(dailyCounts.values())
    const maxDaily = dailyValues.length > 0 ? Math.max(...dailyValues) : 0
    const unlocked = maxDaily >= 10
    return {
      id: 'ten_times_a_day',
      name: '闪电侠',
      description: '单日打卡10次',
      icon: '💥',
      unlocked,
      progress: Math.min(maxDaily, 10),
      target: 10
    }
  }

  private static checkTwentyTimesADay(records: any[]): Achievement {
    const dailyCounts = new Map<string, number>()
    records.forEach(record => {
      const date = dayjs(record.start_time).format('YYYY-MM-DD')
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1)
    })
    const dailyValues = Array.from(dailyCounts.values())
    const maxDaily = dailyValues.length > 0 ? Math.max(...dailyValues) : 0
    const unlocked = maxDaily >= 20
    return {
      id: 'twenty_times_a_day',
      name: '爆肝王者',
      description: '单日打卡20次',
      icon: '💀',
      unlocked,
      progress: Math.min(maxDaily, 20),
      target: 20
    }
  }

  // ========== 单次时长成就 ==========
  private static checkOneHour(stats: any): Achievement {
    const unlocked = stats.maxDuration >= 3600
    return {
      id: 'one_hour_single',
      name: '一柱擎天',
      description: '单次时长1小时',
      icon: '⏰',
      unlocked,
      progress: Math.min(stats.maxDuration, 3600),
      target: 3600
    }
  }

  private static checkThreeHours(stats: any): Achievement {
    const unlocked = stats.maxDuration >= 10800
    return {
      id: 'three_hours_single',
      name: '持久战',
      description: '单次时长3小时',
      icon: '⏳',
      unlocked,
      progress: Math.min(stats.maxDuration, 10800),
      target: 10800
    }
  }

  private static checkFiveHours(stats: any): Achievement {
    const unlocked = stats.maxDuration >= 18000
    return {
      id: 'five_hours_single',
      name: '马拉松',
      description: '单次时长5小时',
      icon: '🏃',
      unlocked,
      progress: Math.min(stats.maxDuration, 18000),
      target: 18000
    }
  }

  // ========== 总时长成就 ==========
  private static checkTenHours(stats: any): Achievement {
    const unlocked = stats.totalDuration >= 36000
    return {
      id: 'ten_hours_total',
      name: '十小时俱乐部',
      description: '总时长达到10小时',
      icon: '⏲️',
      unlocked,
      progress: Math.min(stats.totalDuration, 36000),
      target: 36000
    }
  }

  private static checkTwentyFourHours(stats: any): Achievement {
    const unlocked = stats.totalDuration >= 86400
    return {
      id: 'twenty_four_hours',
      name: '一天一夜',
      description: '总时长达到24小时',
      icon: '🌙',
      unlocked,
      progress: Math.min(stats.totalDuration, 86400),
      target: 86400
    }
  }

  private static checkOneHundredHours(stats: any): Achievement {
    const unlocked = stats.totalDuration >= 360000
    return {
      id: 'one_hundred_hours',
      name: '百时传奇',
      description: '总时长达到100小时',
      icon: '⌚',
      unlocked,
      progress: Math.min(stats.totalDuration, 360000),
      target: 360000
    }
  }

  // ========== 总天数成就 ==========
  private static checkSevenDaysTotal(stats: any): Achievement {
    const unlocked = stats.totalDays >= 7
    return {
      id: 'seven_days_total',
      name: '七日之约',
      description: '累计打卡7天',
      icon: '📅',
      unlocked,
      progress: Math.min(stats.totalDays, 7),
      target: 7
    }
  }

  private static checkThirtyDaysTotal(stats: any): Achievement {
    const unlocked = stats.totalDays >= 30
    return {
      id: 'thirty_days_total',
      name: '月度之星',
      description: '累计打卡30天',
      icon: '📆',
      unlocked,
      progress: Math.min(stats.totalDays, 30),
      target: 30
    }
  }

  private static checkHundredDaysTotal(stats: any): Achievement {
    const unlocked = stats.totalDays >= 100
    return {
      id: 'hundred_days_total',
      name: '百日成就',
      description: '累计打卡100天',
      icon: '🗓️',
      unlocked,
      progress: Math.min(stats.totalDays, 100),
      target: 100
    }
  }
}

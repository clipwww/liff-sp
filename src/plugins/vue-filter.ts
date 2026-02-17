import moment from 'moment'

const filters = {
  formatDate(str: string, hasTime: boolean = true) {
    if (!str) {
      return ''
    }
    return moment(str).format(hasTime ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD')
  },

  formatYear(val: string) {
    return moment(val).format('YYYY')
  },

  formatWeek(val: string) {
    return moment(val).format('wo')
  },

  formatWeekRange(val: string) {
    const start = moment(val).clone().add(1, 'days')
    const end = moment(val).clone().add(7, 'days')
    return `${start.format('M/DD')} ~ ${end.format('M/DD')}`
  },

  commafy(num: string | number, maximumFractionDigits: number = 4) {
    try {
      return (+num).toLocaleString(undefined, { maximumFractionDigits })
    }
    catch (err) {
      return num
    }
  },
}

export function installFilters(app: any) {
  app.config.globalProperties.$filters = filters
}

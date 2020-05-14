import Vue, { VueConstructor } from 'vue';
import moment from 'moment';


const MyVueFilter = function (Vue: VueConstructor, options: any) {

  Vue.filter('formatDate', (str: string, hasTime: boolean = true) => {
    if (!str) {
      return '';
    }
    return moment(str).format(hasTime ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD');
  })

  Vue.filter('formatYear', (val: string) => {
    return moment(val).format('YYYY');
  })

  Vue.filter('formatWeek', (val: string) => {
    return moment(val).format('wo');
  })

  Vue.filter('formatWeekRange', (val: string) => {
    const start = moment(val).clone().add(1, 'days');
    const end = moment(val).clone().add(7, 'days');
    return `${start.format('M/DD')} ~ ${end.format('M/DD')}`;
  })

  Vue.filter('commafy', (num: string | number, maximumFractionDigits: number = 4) => {
    try {
      return (+num).toLocaleString(undefined, { maximumFractionDigits });
    } catch (err) {
      return num;
    }
  })

}

Vue.use(MyVueFilter);

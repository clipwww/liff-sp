import moment, { Moment } from 'moment';

import { turnipRef } from '@/plugins/firebase';
import { LineProfile } from '@/view-models/liff.vm';

export function listenerPriceList(date: Moment, callback: Function) {
  turnipRef
    .child('price')
    .child(moment(date).format('YYYY-MM-DD'))
    .on('value', snapshot => {
      const data = snapshot.val();
      if (!data) {
        return callback([]);
      }

      const list = Object.keys(data).map(key => {
        return {
          id: key,
          ...data[key],
        }
      });

      callback(list);
    });
}

export function removeListenerPriceList(date: Moment) {
  return turnipRef
    .child('price')
    .child(moment(date).format('YYYY-MM-DD')).off();
}

export function getPriceByUserId(userId: string, date: Moment) {
  return new Promise((reslove) => {
    turnipRef
      .child('price')
      .child(moment(date).format('YYYY-MM-DD'))
      .child(userId)
      .once('value', snapshot => {
        const data = snapshot.val();

        reslove(data);
      });
  })
}

export function listenerUserList(callback: Function) {
  turnipRef
    .child('profile')
    .once('value', snapshot => {
      const data = snapshot.val();
      if (!data) {
        return callback([]);
      }

      const list = Object.keys(data).map(key => {
        return {
          id: key,
          ...data[key]
        }
      });

      callback(list);
    });
}

export function removeListenerUserList() {
  return turnipRef
    .child('profile').off();
}


export function updatePriceByUserId(userId: string, date: Moment, params: { buyPrice: any, sellPrice: any }) {
  return turnipRef
    .child('price')
    .child(moment(date).format('YYYY-MM-DD'))
    .child(userId)
    .set(params);
}

export function updateProfileByUserId(userId: string, params: LineProfile) {
  return turnipRef
    .child('profile')
    .child(userId)
    .set(params);
}

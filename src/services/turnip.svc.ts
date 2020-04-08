import moment, { Moment } from 'moment';

import { turnipRef } from '@/plugins/firebase';
import { LineProfile } from '@/view-models/liff.vm';

export function getPriceList(date: Moment) {
  return new Promise((reslove) => {
    turnipRef
      .child('price')
      .child(moment(date).format('YYYY-MM-DD'))
      .once('value', snapshot => {
        const data = snapshot.val();
        if (!data) {
          return reslove([]);
        }

        const list = Object.keys(data).map(key => {
          return {
            id: key,
            ...data[key],
          }
        });
        reslove(list);
      });
  })
}

export function getPriceByUserId(userId: string, date: Moment) {
  return new Promise((reslove) => {
    turnipRef
      .child('price')
      .child(moment(date).format('YYYY-MM-DD'))
      .child(userId || 'abc')
      .once('value', snapshot => {
        const data = snapshot.val();

        reslove(data);
      });
  })
}

export function getUserList() {
  return new Promise((reslove) => {
    turnipRef
      .child('profile')
      .once('value', snapshot => {
        const data = snapshot.val();
        if (!data) {
          return reslove([]);
        }

        const list = Object.keys(data).map(key => {
          return {
            id: key,
            ...data[key]
          }
        });

        reslove(list);
      });
  })
}

export function updatePriceByUserId(userId: string, date: Moment, params: { buyPrice: any, sellPrice: any }) {
  return turnipRef
    .child('price')
    .child(moment(date).format('YYYY-MM-DD'))
    .child(userId || 'abc')
    .set(params);
}

export function updateProfileByUserId(userId: string, params: LineProfile) {
  return turnipRef
    .child('profile')
    .child(userId || 'abc')
    .set(params);
}

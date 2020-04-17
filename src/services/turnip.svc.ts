import moment, { Moment } from 'moment';
import * as uuid from 'uuid';

import { turnipRef } from '@/plugins/firebase';
import { LineProfile } from '@/view-models/liff.vm';

export function listenerPriceList(date: Moment, callback: Function) {
  return new Promise((reslove) => {
    turnipRef
      .child('price')
      .child(moment(date).format('YYYY-MM-DD'))
      .on('value', snapshot => {
        reslove();
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
  })
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

export function listenerHistoriesByUserId(userId: string, callback: Function) {
  turnipRef
    .child('price')
    .on('value', snapshot => {
      try {
        const data = snapshot.val();
        let list: any[] = [];
        Object.keys(data).forEach(date => {
          if (data[date][userId]) {
            list.push({
              id: date,
              ...data[date][userId]
            })
          }
        })

        callback(list);
      } catch (err) {
        console.log(err)
        callback([]);
      }
    });
}

export function removeListenerHistoriesByUserId() {
  return turnipRef
    .child('price').off();
}

export function listenerUserList(callback: Function) {
  turnipRef
    .child('profile')
    .on('value', snapshot => {
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
    .set({
      ...params,
      dateUpdated: moment().toISOString(),
    });
}

export function updateProfileByUserId(userId: string, params: LineProfile) {
  return turnipRef
    .child('profile')
    .child(userId)
    .set({
      ...params,
      dateUpdated: moment().toISOString(),
    });
}

export function listenerGroupList(callback: Function) {
  return new Promise((reslove) => {
    turnipRef
      .child('group').on('value', snapshot => {
        reslove();
        const data = snapshot.val();
        if (!data) {
          return callback([]);
        }

        const list = Object.keys(data).map(key => data[key]);

        callback(list);
      });
  })
}

export function removeListenerGroupList() {
  return turnipRef
    .child('group').off();
}



export function createGroup(params: { name: string, password: string, creatorId: string }) {
  const newId = uuid.v4();
  return turnipRef
    .child('group')
    .child(newId)
    .set({
      ...params,
      id: newId,
      dateCreated: moment().toISOString(),
      members: [params.creatorId]
    });
}

export function updateGroup(groupId: string, params: any) {
  return turnipRef
    .child('group')
    .child(groupId)
    .set({
      ...params,
      dateUpdated: moment().toISOString(),
    });
}

export function removeGroup(groupId: string) {
  return turnipRef
    .child('group')
    .child(groupId)
    .remove();
}


export function listenerGroupById(groupId: string, callback: Function) {
  return new Promise((reslove) => {
    turnipRef
      .child('group').child(groupId).on('value', snapshot => {
        reslove();
        const data = snapshot.val();
        if (!data) {
          return callback(null);
        }

        callback(data);
      });
  })
}

export function removeListenerGroupById(groupId: string) {
  return turnipRef
    .child('group').child(groupId).off();
}


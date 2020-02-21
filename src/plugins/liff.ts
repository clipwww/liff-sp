import { Toast } from 'vant';

import { LiffError } from '@/view-models/liff.vm';

const liff = window.liff;
export const installLIFF = async () => {
  const liffId = process.env.VUE_APP_LIFF_ID as string;
  console.log(liff, liffId);

  if (!liffId) {
    Toast.fail('缺少Liff Id，請檢查.env');
    return;
  }

  try {
    await liff.init({
      liffId
    });
  } catch (err) {
    Toast.fail((err as LiffError).message);
  }

  console.log(liff.getVersion());
};

export const sendAlertIfNotInClient = () => {
  Toast.fail('這個功能只能在Line裡面使用！');
};

export const scanCode = async () => {
  if (!liff.isInClient()) {
    sendAlertIfNotInClient();
    return;
  }

  if (!liff.scanCode) {
    Toast.fail('您的裝置不支援LIFF掃描功能！');
    return;
  }

  try {
    const ret = await liff.scanCode();
    return ret;
  } catch (err) {
    Toast.fail(err.message);
    return;
  }
};

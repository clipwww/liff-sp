import type { LiffError } from '@/view-models/liff.vm'

import { Toast } from '@/plugins/vant'

const liff = window.liff
export async function installLIFF() {
  const liffId = import.meta.env.VUE_APP_LIFF_ID as string
  console.log(liff, liffId)

  if (!liffId) {
    Toast.fail('缺少Liff Id，請檢查.env')
    return
  }

  try {
    await liff.init({
      liffId,
    })
  }
  catch (err) {
    Toast.fail((err as LiffError).message)
  }

  console.log(liff.getVersion())
}

export function sendAlertIfNotInClient() {
  Toast.fail('這個功能只能在Line裡面使用！')
}

export async function scanCode() {
  if (!liff.isInClient()) {
    sendAlertIfNotInClient()
    return
  }

  if (!liff.scanCode) {
    Toast.fail('您的裝置不支援LIFF掃描功能！')
    return
  }

  try {
    const ret = await liff.scanCode()
    return ret
  }
  catch (err) {
    Toast.fail(err.message)
  }
}

export async function shareTargetPicker(message: any[]) {
  try {
    await liff.shareTargetPicker(message)

    return true
  }
  catch (err) {
    console.error(err)
    alert(err.message)
    return false
  }
}

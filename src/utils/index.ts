import { Toast } from '@/plugins/vant'
import moment from 'moment'
import device from 'current-device'

export function toSafeHtmlString(htmlString: string) {
  return htmlString.replace(/(javascript\s*:)/g, 'javascripts：')
    .replace(/(@import)/g, 'import')
    .replace(/<\/?(script|meta|link|frame|iframe|style).*>/g, str =>
      str
        .replace(/</g, '&lt')
        .replace(/>/g, '&gt')
        .replace(/"/g, '&quot;'),
    )
    .replace(
      /(ondblclick|onclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onload|onunload|onerror)=[^<]*(?=\>)/g,
      str => `__${str}`,
    )
    .replace(/\n/g, '<br/>') ?? ''
};

export function toPureHtmlString(htmlString: string) {
  return toSafeHtmlString(htmlString)
    .replace(
      /(href)=[^<]*(?=\>)/g,
      str => `__${str}`,
    )
    .trim()
};

export const lsUtil = {

  set: (key: string, value: string): void => {
    window.localStorage.setItem(key, value)
  },

  get: (key: string): string => {
    return window.localStorage.getItem(key) || ''
  },

  setObj: (key: string, value: object | any[]): void => {
    window.localStorage.setItem(key, JSON.stringify(value))
  },

  getObj: (key: string): any => {
    try {
      const value = window.localStorage.getItem(key)
      if (value) {
        return JSON.parse(value)
      }
    } catch (err) {
      Toast.fail(err.message)
    }
    return ''
  },

  remove: (key: string): void => {
    window.localStorage.removeItem(key)
  },
}

export const momentUtil = (() => {
  function getWeekStart() {
    return moment().startOf('week').clone()
  }

  function getWeekdays() {
    return Array(6)
      .fill('')
      .map((v, i) => {
        const momentInstance = getWeekStart().add(i + 1, 'day')
        return {
          id: `w${momentInstance.weekday()}`,
          label: momentInstance.format('M/D (ddd)'),
          momentInstance,
        }
      })
  }

  return {
    getWeekStart,
    getWeekdays,
  }
})()

export function copyValue(value: string): boolean {
  const isIOS = device.ios()

  if (!isIOS) {
    window.addEventListener('copy', copyHandler(value))
  }

  const $textArea = document.createElement('textArea') as HTMLTextAreaElement
  const className = `copy-value-${+new Date()}`
  $textArea.className = className

  const $style = document.createElement('style')
  $style.innerHTML = `
    .${className} {
      opacity: 0;
      position: absolute;
      top: -99999px;
      z-index: -1;
      -webkit-touch-callout: unset !important;
      -webkit-user-select: text !important;
      user-select: text !important;
    }
  `

  $textArea.value = value
  document.body.appendChild($textArea)
  document.body.appendChild($style)

  const editable = $textArea.contentEditable
  const readOnly = $textArea.readOnly

  // @ts-expect-error
  $textArea.contentEditable = true
  $textArea.readOnly = true

  try {
    const range = document.createRange()
    range.selectNodeContents($textArea)

    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    $textArea.setSelectionRange(0, 999999)
  } catch (err) {
    $textArea.select()
  }

  $textArea.contentEditable = editable
  $textArea.readOnly = readOnly

  const isOK = document.execCommand('copy')

  if (!isIOS) {
    window.removeEventListener('copy', copyHandler(value))
  }
  document.body.removeChild($textArea)
  document.body.removeChild($style)

  return isOK
}

export function copyHandler(value: string): (e: Event) => void {
  return (e: Event) => {
    e.preventDefault();
    (e as ClipboardEvent).clipboardData?.setData('text/plain', value)
  }
}

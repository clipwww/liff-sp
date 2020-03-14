import { Toast } from 'vant';


export function toSafeHtmlString(htmlString: string) {
  return htmlString.replace(/(javascript\s*:)/g, 'javascripts：')
    .replace(/(@import)/g, 'import')
    .replace(/<\/?(script|meta|link|frame|iframe|style).*>/g, str =>
      str
        .replace(/</g, '&lt')
        .replace(/>/g, '&gt')
        .replace(/"/g, '&quot;')
    )
    .replace(
      /(ondblclick|onclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onload|onunload|onerror)=[^<]*(?=\>)/g,
      str => `__${str}`
    )
    .replace(/\n/g, '<br/>') ?? '';
};

export function toPureHtmlString(htmlString: string) {
  return toSafeHtmlString(htmlString)
    .replace(
      /(href)=[^<]*(?=\>)/g,
      str => `__${str}`
    )
    .trim();
};




export const lsUtil = {

  set: (key: string, value: string): void => {
    window.localStorage.setItem(key, value);
  },

  get: (key: string): string => {
    return window.localStorage.getItem(key) || '';
  },

  setObj: (key: string, value: object | any[]): void => {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  getObj: (key: string): any => {
    try {
      const value = window.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
    } catch (err) {
      Toast.fail(err.message);
    }
    return '';
  },

  remove: (key: string): void => {
    window.localStorage.removeItem(key);
  }
};
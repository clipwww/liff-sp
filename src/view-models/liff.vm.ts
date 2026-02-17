// ref. https://developers.line.biz/en/reference/liff/

export interface Liff {
  init: (params: { liffId: string }) => Promise<void | LiffError>
  getOS: () => 'ios' | 'android' | 'web'
  getLanguage: () => string
  getVersion: () => string
  isInClient: () => boolean
  isLoggedIn: () => boolean
  login: (loginConfig?: { redirectUri?: string }) => void
  logout: () => void
  /**
   * 取得令牌
   * 當使用者關閉Liff時令牌將被註銷
   */
  getAccessToken: () => string
  /**
   * 使用內部或外部瀏覽器開啟時會回傳 null
   */
  getContext: () => LineContext | null
  /**
   * 若沒有取得 openid 的權限會獲得null
   */
  getDecodedIDToken: () => Promise<DecodedIDToken | null>
  getProfile: () => Promise<LineProfile>
  /**
   * 取得與 該LINE Login Channel連結的 官方帳號 (LINE Official Account) 友誼狀態
   * friendFlag: true代表有與官方帳號加好友
   */
  getFriendship: () => Promise<{ friendFlag: boolean }>
  /**
   * 傳送訊息 格式詳見： https://developers.line.biz/en/reference/liff/#send-messages
   * 成功的話不會有回傳
   * 失敗的話回傳status code
   *  400: The message is invalid.
   *  401: Authentication failed.
   *  403: The access token does not have appropriate permissions.
   */
  sendMessages: (messages: Array<any>) => Promise<void | string>
  /**
   *  在內部或外部瀏覽器打開連結
   */
  openWindow: (params: { url: string, external: boolean }) => void
  /**
   * 開啟掃瞄器
   * 只在Line內部以及iOs < 9.19.0版本
   */
  scanCode?: () => Promise<{ value: string }>
  /**
   * 顯示群組、好友選擇
   * 可將客製化訊息傳送出去
   * @param messages
   * ref. https://developers.line.biz/flex-simulator/
   */
  shareTargetPicker: (messages: Array<any>) => Promise<void>
  closeWindow: () => void
  initPlugins: (pluginNames: Array<string>) => Promise<void | string>
  bluetooth: {
    getAvailability: () => Promise<boolean>
    requestDevice: (options?: any) => Promise<any>
  }
}

export interface LiffError {
  code: string
  message: string
  pictureUrl: string
  statusMessag?: string
}

export interface LineContext {
  type: 'utou' | 'room' | 'group' | 'none'
  viewType: 'compact' | 'tall' | 'full'
  userId?: string
  utouId?: string
  roomId?: string
  groupId?: string
}

export interface LineProfile {
  userId: string
  displayName: string
  pictureUrl: string
  statusMessage: string
}

export interface DecodedIDToken {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  nonce: string
  amr: string[]
  name: string
  picture: string
}

export interface FlexMessage {
  type: 'flex'
  altText: string // 替代文字
  contents: any[]
}

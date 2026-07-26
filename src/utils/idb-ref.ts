/**
 * Firebase Realtime Database 相容的 IndexedDB 包裝器。
 * 將整個命名空間（如 'movie'、'turnip'）儲存為單一 JSON 物件，
 * 支援巢狀路徑讀寫與即時監聽器通知。
 */

const DB_NAME = 'liff-sp'
const STORE_NAME = 'kv'

let _db: IDBDatabase | null = null

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (_db) { resolve(_db); return }
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result
      resolve(_db!)
    }
    req.onerror = e => reject((e.target as IDBOpenDBRequest).error)
  })
}

async function readNamespace(ns: string): Promise<Record<string, any>> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(ns)
    req.onsuccess = () => resolve(req.result ?? {})
    req.onerror = () => reject(req.error)
  })
}

async function writeNamespace(ns: string, data: Record<string, any>): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const req = tx.objectStore(STORE_NAME).put(data, ns)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

// 監聽器管理：namespace → path → Set<callback>
type Callback = (snapshot: IdbSnapshot) => void
const listenerMap = new Map<string, Map<string, Set<Callback>>>()

function addListener(ns: string, path: string, cb: Callback): void {
  if (!listenerMap.has(ns)) { listenerMap.set(ns, new Map()) }
  const nsMap = listenerMap.get(ns)!
  if (!nsMap.has(path)) { nsMap.set(path, new Set()) }
  nsMap.get(path)!.add(cb)
}

function removeListener(ns: string, path: string, cb?: Callback): void {
  const nsMap = listenerMap.get(ns)
  if (!nsMap) { return }
  if (cb) {
    nsMap.get(path)?.delete(cb)
  }
  else {
    nsMap.delete(path)
  }
}

function notifyListeners(ns: string, root: Record<string, any>): void {
  const nsMap = listenerMap.get(ns)
  if (!nsMap) { return }
  for (const [path, cbs] of nsMap) {
    const data = path
      ? path.split('/').reduce<any>((acc, k) => (acc && typeof acc === 'object' ? acc[k] ?? null : null), root)
      : root
    const snap = new IdbSnapshot(data)
    cbs.forEach(cb => cb(snap))
  }
}

function getNestedValue(root: Record<string, any>, parts: string[]): any {
  return parts.reduce<any>((acc, k) => (acc && typeof acc === 'object' ? acc[k] ?? null : null), root)
}

function setNestedValue(root: Record<string, any>, parts: string[], value: any): Record<string, any> {
  if (!parts.length) { return value as Record<string, any> }
  const result: Record<string, any> = { ...root }
  let cur: Record<string, any> = result
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]
    cur[k] = { ...(cur[k] && typeof cur[k] === 'object' ? cur[k] : {}) }
    cur = cur[k]
  }
  cur[parts[parts.length - 1]] = value
  return result
}

function deleteNestedValue(root: Record<string, any>, parts: string[]): Record<string, any> {
  if (!parts.length) { return {} }
  const result: Record<string, any> = { ...root }
  let cur: Record<string, any> = result
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]
    cur[k] = { ...(cur[k] && typeof cur[k] === 'object' ? cur[k] : {}) }
    cur = cur[k]
  }
  delete cur[parts[parts.length - 1]]
  return result
}

export class IdbSnapshot {
  constructor(private readonly _data: any) {}

  val(): any { return this._data }

  child(key: string): IdbSnapshot {
    const childData = this._data && typeof this._data === 'object'
      ? this._data[key] ?? null
      : null
    return new IdbSnapshot(childData)
  }
}

export class IdbRef {
  constructor(
    private readonly ns: string,
    private readonly parts: string[] = [],
  ) {}

  child(key: string): IdbRef {
    return new IdbRef(this.ns, [...this.parts, key])
  }

  /** 訂閱路徑變更，立即以目前快取值呼叫一次 callback */
  on(_event: 'value', cb: Callback): void {
    const path = this.parts.join('/')
    addListener(this.ns, path, cb)
    readNamespace(this.ns).then((root) => {
      cb(new IdbSnapshot(getNestedValue(root, this.parts)))
    })
  }

  /** 單次讀取，可選 callback，同時回傳 Promise<IdbSnapshot> */
  async once(_event: 'value', cb?: Callback): Promise<IdbSnapshot> {
    const root = await readNamespace(this.ns)
    const snap = new IdbSnapshot(getNestedValue(root, this.parts))
    if (cb) { cb(snap) }
    return snap
  }

  /** 寫入值並通知所有監聽器 */
  async set(value: any): Promise<void> {
    const root = await readNamespace(this.ns)
    const newRoot = setNestedValue(root, this.parts, value)
    await writeNamespace(this.ns, newRoot)
    // 非同步通知以避免監聽器回呼中的同步循環
    setTimeout(() => notifyListeners(this.ns, newRoot), 0)
  }

  /** 刪除路徑並通知所有監聽器 */
  async remove(): Promise<void> {
    const root = await readNamespace(this.ns)
    const newRoot = deleteNestedValue(root, this.parts)
    await writeNamespace(this.ns, newRoot)
    setTimeout(() => notifyListeners(this.ns, newRoot), 0)
  }

  /** 取消訂閱。不傳 callback 則移除該路徑的所有監聽器 */
  off(cb?: Callback): void {
    removeListener(this.ns, this.parts.join('/'), cb)
  }
}

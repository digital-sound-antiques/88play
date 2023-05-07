import md5 from "md5";

async function _put(store: IDBObjectStore, data: Uint8Array, id?: string | null): Promise<string> {
  return new Promise((resolve, reject) => {
    const key = id ?? md5(data);
    const req = store.put(data, key);
    req.onerror = reject;
    req.onsuccess = (event) => resolve((event.target as IDBRequest<string>).result);
  });
}

async function _get(store: IDBObjectStore, key: string): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onerror = reject;
    req.onsuccess = (event) => resolve((event.target as IDBRequest<Uint8Array>).result);
  });
}

async function _getAllKeys(store: IDBObjectStore): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const req = store.getAllKeys();
    req.onerror = reject;
    req.onsuccess = (event) => resolve((event.target as IDBRequest<string[]>).result);
  });
}

async function _getKey(store: IDBObjectStore, key: string): Promise<string|undefined> {
  return new Promise((resolve, reject) => {
    const req = store.getKey(key);
    req.onerror = reject;
    req.onsuccess = (event) => resolve((event.target as IDBRequest<string|undefined>).result);
  });
}

async function _delete(store: IDBObjectStore, key: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const req = store.delete(key);
    req.onerror = reject;
    req.onsuccess = (_) => resolve();
  });
}

async function _clear(store: IDBObjectStore): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const req = store.clear();
    req.onerror = reject;
    req.onsuccess = (_) => resolve();
  });
}

export class BinaryDataStorage {
  constructor(storeName?: string | null) {
    this.storeName = storeName ?? "binaries";
  }

  db?: IDBDatabase | null = null;
  storeName: string;

  async open(name: string, dbFactory?: IDBFactory | null): Promise<void> {
    this.db = await new Promise((resolve, reject) => {
      const VERSION = 1;
      const req = (dbFactory ?? window.indexedDB).open(name, VERSION);
      req.onerror = reject;
      req.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);
      req.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (event.oldVersion == 0) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async hasKey(id: string): Promise<boolean> {
    const tx = this.db!.transaction(this.storeName, "readonly");
    const store = tx.objectStore(this.storeName);
    const res = await _getKey(store, id);
    return res != null;
  }

  async get(id: string) {
    const tx = this.db!.transaction(this.storeName, "readonly");
    const store = tx.objectStore(this.storeName);
    return await _get(store, id);
  }

  async put(data: Uint8Array, id?: string | null): Promise<string> {
    const tx = this.db!.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    return _put(store, data, id);
  }

  async getAllKeys(): Promise<string[]> {
    const tx = this.db!.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    return _getAllKeys(store);
  }

  async gc(keysToPreserve: string[]): Promise<void> {
    const tx = this.db!.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    const keys = await _getAllKeys(store);
    for (const key of keys) {
      if (keysToPreserve.indexOf(key) < 0) {
        try {
          await _delete(store, key);
        } catch (e) {}
      }
    }
  }

  async clear() {
    const tx = this.db!.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    await _clear(store);
  }

  async close() {
    this.db?.close();
  }
}

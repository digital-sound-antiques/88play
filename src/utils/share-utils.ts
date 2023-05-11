const apiSet = {
  production: {
    dataApi: "https://asia-northeast1-play-f7a8b.cloudfunctions.net/databin",
    textApi: "https://asia-northeast1-play-f7a8b.cloudfunctions.net/textbin",
    getDataUrl: (key: string) =>
      `https://firebasestorage.googleapis.com/v0/b/play-f7a8b.appspot.com/o/databin%2F${key}?alt=media`,
    getTextUrl: (key: string) =>
      `https://firebasestorage.googleapis.com/v0/b/play-f7a8b.appspot.com/o/textbin%2F${key}?alt=media`,
  },
  develop: {
    textApi: "http://localhost:5001/play-f7a8b/asia-northeast1/textbin",
    dataApi: "http://localhost:5001/play-f7a8b/asia-northeast1/databin",
    getTextUrl: (key: string) =>
      `http://localhost:9199/play-f7a8b.appspot.com/textbin%2F${key}`,
      getDataUrl: (key: string) =>
      `http://localhost:9199/play-f7a8b.appspot.com/databin%2F${key}`,
  },
};

const api = apiSet.production;

export const shareApi = api;

export async function downloadBinary(id: string): Promise<Uint8Array> {
  const url = api.getDataUrl(id);
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.send();
    req.onload = (_) => {
      if (req.status == 200) {
        resolve(new Uint8Array(req.response));
      } else {
        reject(new Error(`${req.status} ${req.statusText}`));
      }
    };
    req.onerror = (_) => {
      reject(new Error("Unknown Error"));
    };
  });
}

export async function uploadBinary(u8a: Uint8Array): Promise<string> {
  const url = api.dataApi;
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader("content-type", "application/octet-stream");
    req.send(u8a);
    req.onload = (_) => {
      if (200 <= req.status && req.status < 300) {
        resolve(req.responseText);
      } else {
        reject(new Error(`${req.status} ${req.statusText}`));
      }
    };
    req.onerror = (_) => {
      reject(new Error("Unknown Error"));
    };
  });
}

export async function uploadText(text: string): Promise<string> {
  const url = api.textApi;
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.setRequestHeader("content-type", "text/plain");
    req.send(text);
    req.onload = (_) => {
      if (200 <= req.status && req.status < 300) {
        resolve(req.responseText);
      } else {
        reject(new Error(`${req.status} ${req.statusText}`));
      }
    };
    req.onerror = (_) => {
      reject(new Error("Unknown Error"));
    };
  });
}

export async function checkDataExists(id: string) {
  const url = api.getDataUrl(id);
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open("HEAD", url, true);
    req.send();
    req.onload = (_) => {
      resolve(req.status == 200 || req.status == 304);
    };
    req.onerror = (_) => {
      reject(new Error(`Failed to check existency of ${id}`));
    };
  });
}

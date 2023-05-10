import { TextDecoderEncoding, detectEncoding } from "./detect-encoding";

export const convertUrlIfRequired = (url: string) => {
  const m = url.match(/^(https:\/\/)?f\.msxplay\.com\/([0-9a-z]+)/i);
  if (m != null) {
    return `https://firebasestorage.googleapis.com/v0/b/msxplay-63a7a.appspot.com/o/pastebin%2F${m[2]}?alt=media`;
  }
  return url;
};

export function decodeAsText(u8: Uint8Array): string {
  let encoding = detectEncoding(u8);

  if (encoding == "euc-jp" || encoding == "iso-2022-jp") {
    encoding = "shift-jis";
  } else if (
    encoding == "utf-8" ||
    encoding == "ascii" ||
    encoding == "binary"
  ) {
    encoding = "utf-8";
  }

  return new TextDecoder(encoding as TextDecoderEncoding)
    .decode(u8)
    .replace(/\r\n/g, "\n");
}

export async function loadBlobOrUrlAsText(
  file: Blob | URL | string
): Promise<string> {
  if (file instanceof Blob) {
    return loadBlobAsText(file);
  } else {
    const res = await fetch(file);
    return decodeAsText(new Uint8Array(await res.arrayBuffer()));
  }
}

export async function loadBlobAsText(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const u8 = new Uint8Array(reader.result as ArrayBuffer);
        resolve(decodeAsText(u8));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

export async function loadBlobOrUrl(
  file: Blob | URL | string
): Promise<Uint8Array> {
  if (file instanceof Blob) {
    return loadBlob(file);
  } else {
    const res = await fetch(file);
    return new Uint8Array(await res.arrayBuffer());
  }
}

export async function loadBlob(blob: Blob): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const u8 = new Uint8Array(reader.result as ArrayBuffer);
        resolve(u8);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

export function addLineNumber(mml: string, crLf: boolean): string {
  const lines = mml.split("\n");
  const buf: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    buf.push(`${(i + 1) * 10} '${lines[i]}`);
  }
  return buf.join(crLf ? "\r\n" : "\n");
}

export function removeLineNumber(mml: string): string {
  const lines = mml.replace("\r\n", "\n").split("\n");
  const buf: string[] = [];
  for (const line of lines) {
    const m = line.match(/^[0-9]+\s+'?(.*)$/);
    if (m != null) {
      buf.push(m[1]);
    } else {
      buf.push(line);
    }
  }
  return buf.join('\n');
}

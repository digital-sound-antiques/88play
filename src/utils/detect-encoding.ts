
import * as EncodingDetect from "./encoding-detect";

/**
 * Encoding label that can be accepted TextDecoder.
 */
export type TextDecoderEncoding = "utf-16le" | "utf-16be" | "utf-8" | "shift-jis" | "euc-jp" | "iso-2022-jp";

/**
 * Detect a text encoding from a given data stream.
 */
export function detectEncoding(data: ArrayLike<number>): TextDecoderEncoding | "ascii" | "binary" | null {
  if (EncodingDetect.isUTF16LE(data)) {
    return "utf-16le";
  }
  if (EncodingDetect.isUTF16BE(data)) {
    return "utf-16be";
  }
  if (EncodingDetect.isBINARY(data)) {
    return "binary";
  }
  if (EncodingDetect.isASCII(data)) {
    return "ascii";
  }
  if (EncodingDetect.isJIS(data)) {
    return "iso-2022-jp";
  }
  if (EncodingDetect.isUTF8(data)) {
    return "utf-8";
  }
  if (EncodingDetect.isEUCJP(data)) {
    return "euc-jp";
  }
  if (EncodingDetect.isSJIS(data)) {
    return "shift-jis";
  }
  return null;
}

/**
 * Parse string as encoding name for TextDecoder.
 */
export function toTextDecoderEncoding(text: string | null): TextDecoderEncoding | null {
  const normalized = text?.trim().toLowerCase().replace(/[\-_]/g, "");
  switch (normalized) {
    case "utf16":
      throw new Error(`${text} is ambiguous. Use utf-16le or utf-16be instead.`);
    case "utf16le":
      return "utf-16le";
    case "ucs2":
    case "utf16be":
      return "utf-16be";
    case "iso646":
    case "cp367":
    case "ascii":
    case "utf8":
      return "utf-8";
    case "iso2022jp":
    case "jis":
      return "iso-2022-jp";
    case "eucjp":
      return "euc-jp";
    case "sjis":
    case "shiftjis":
    case "cp932":
    case "ms932":
      return "shift-jis";
    default:
      return null;
  }
}

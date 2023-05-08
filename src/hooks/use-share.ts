import { useContext } from "react";
import { MMLResourceEntry } from "../contexts/EditorContext";
import { getResourceMap } from "../contexts/EditorContextReducer";
import { StorageContext } from "../contexts/StorageContext";
import {
  checkDataExists,
  uploadBinary,
  uploadText,
} from "../utils/share-utils";

export function useShare() {
  const { storage } = useContext(StorageContext);

  const uploadData = async ({
    name,
    id,
  }: MMLResourceEntry): Promise<string> => {
    const data = await storage.get(id!);
    if (data == null) {
      throw new Error(`No binary for ${name} in local storage.`);
    }
    return await uploadBinary(data);
  };

  const share = async (
    mml: string,
    setProgress?: ((progress: number | null) => void) | null
  ): Promise<{ id: string; url: string }> => {
    const rmap = getResourceMap(mml);
    setProgress?.(0.0);
    const entries = Object.values(rmap);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const { id } = entry;
      if (id != null) {
        if (!(await checkDataExists(id))) {
          await uploadData(entry);
        }
      }
      setProgress?.((0.5 * i) / entries.length);
    }
    setProgress?.(0.5);
    const res = await uploadText(mml);
    setProgress?.(1.0);

    return JSON.parse(res);
  };

  return [share];
}

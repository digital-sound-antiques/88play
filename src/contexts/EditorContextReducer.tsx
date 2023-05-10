import { BinaryDataStorage } from "../utils/binary-data-storage";
import { loadBlobOrUrl, loadBlobOrUrlAsText, removeLineNumber } from "../utils/load-urls";
import { downloadBinary } from "../utils/share-utils";
import {
  EditorContextState,
  MMLResourceEntry,
  MMLResourceMap,
} from "./EditorContext";

export class EditorContextReducer {
  constructor(
    setState: React.Dispatch<React.SetStateAction<EditorContextState>>,
    storage?: BinaryDataStorage
  ) {
    this.setState = setState;
    this.storage = storage;
  }

  setState: React.Dispatch<React.SetStateAction<EditorContextState>>;
  storage?: BinaryDataStorage;

  getLatestState = async (): Promise<EditorContextState> => {
    return new Promise((resolve) => {
      this.setState((state) => {
        resolve(state);
        return state;
      });
    });
  };

  setBusy(value: boolean) {
    this.setState((state) => ({ ...state, busy: value }));
  }

  loadAsMML = async (
    file: File | URL | string
  ): Promise<[string | null, MMLResourceMap | null]> => {
    const name = this.getName(file);

    if (/\.(bin|dat|mub)$/.test(name)) {
      return [null, null];
    }
    const text = removeLineNumber(await loadBlobOrUrlAsText(file));
    if (text != null) {
      if (
        text.indexOf("#mucom88") >= 0 ||
        text.indexOf("#title") >= 0 ||
        text.indexOf("#voice") >= 0 ||
        text.indexOf("#pcm") >= 0 ||
        /\.(muc|txt|mml)$/i.test(name)
      ) {
        const parts = [];
        if (!/^;#name/gm.test(text)) {
          const head = `;#name ${name.replace(/[=\s]/g, "")}`;
          parts.push(head);
        }
        parts.push(text);
        const mml = parts.join("\n");
        const rmap = getResourceMap(mml);
        await downloadResources(this.storage!, rmap);
        return [mml, rmap];
      }
    }
    return [null, null];
  };

  getName = (file: File | URL | string): string => {
    if (file instanceof File) {
      return file.name;
    }
    return file.toString().split("/").pop() ?? "88play.muc";
  };

  onFileOpen = async (
    files: FileList | (URL | string)[] | null
  ): Promise<void> => {
    this.setState((state) => ({ ...state, busy: true }));

    const state = await this.getLatestState();
    let resourceMap = { ...state.resourceMap };
    let mml = state.text;

    // load MML. only the first file is accepted.
    for (const file of files ?? []) {
      const res = await this.loadAsMML(file);
      if (res[0] != null && res[1] != null) {
        mml = res[0];
        resourceMap = res[1];
        break;
      }
    }

    // load resources specified in MML
    for (const file of files ?? []) {
      const name = this.getName(file);
      const entry = resourceMap[name];
      if (entry != null) {
        const data = await loadBlobOrUrl(file);
        const dataId = await this.storage!.put(data);
        if (dataId != null) {
          entry.id = dataId;
        }
      }
    }

    const unresolvedResources = await getUnresolvedResources(
      this.storage!,
      resourceMap
    );

    this.setState((state) => ({
      ...state,
      text: embedHashTag(mml, resourceMap),
      resourceMap,
      unresolvedResources,
      busy: false,
    }));
  };

  updateText = async (value: string) => {
    this.setState((state) => {
      if (state.text != value) {
        return {
          ...state,
          text: value,
        };
      }
      return state;
    });
  };

  onChangeText = (value: string) => {
    this.updateText(value);
  };

  updateUnresolvedResources = async (
    mml: string
  ): Promise<MMLResourceEntry[]> => {
    const resourceMap = getResourceMap(mml);
    const unresolvedResources = await getUnresolvedResources(
      this.storage!,
      resourceMap
    );
    this.setState((state) => ({ ...state, resourceMap, unresolvedResources }));
    return unresolvedResources;
  };
}

export function getFileHashMap(lines: string[]): { [key: string]: string } {
  const pattern = /^;?#hash\s+(.+)\s(.+)$/;
  const res: { [key: string]: string } = {};
  for (const line of lines) {
    const m = line.match(pattern);
    if (m != null) {
      const name = m[1].trim();
      const hash = m[2].trim();
      res[name] = hash;
    }
  }
  return res;
}

export function getResourceMap(mml: string): MMLResourceMap {
  const lines = mml.split("\n");
  const fileHashMap = getFileHashMap(lines);
  const pattern = /^#(pcm|voice)\s(.+)$/;
  const res: MMLResourceMap = {};
  for (const line of lines) {
    const m = line.match(pattern);
    if (m != null) {
      const type = m[1] == "pcm" ? "pcm" : "voice";
      const name = m[2].trim();
      if (name != "") {
        const id = fileHashMap[name];
        if (id != null) {
          res[name] = { type, name, id };
        } else {
          res[name] = { type, name, id: null };
        }
      }
    }
  }
  return res;
}

export async function getUnresolvedResources(
  storage: BinaryDataStorage,
  rmap: MMLResourceMap
): Promise<MMLResourceEntry[]> {
  const res: MMLResourceEntry[] = [];
  for (const entry of Object.values(rmap)) {
    const id = entry.id;
    if (id != null) {
      if (!(await storage.hasKey(id))) {
        res.push(entry);
      }
    } else {
      res.push(entry);
    }
  }
  return res;
}

// download resources if not exist in local storage.
export async function downloadResources(
  storage: BinaryDataStorage,
  rmap: MMLResourceMap
) {
  for (const entry of Object.values(rmap)) {
    const id = entry.id;
    if (id != null) {
      if (!(await storage.hasKey(id))) {
        try {
          const remoteData = await downloadBinary(id);
          const res = await storage.put(remoteData);
          console.log(`download and registered: ${res}`);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
}

export function embedHashTag(mml: string, rmap: MMLResourceMap): string {
  const hashPattern = /^;?#hash\s/;
  const lines = mml.split(/\n/).filter((e) => !hashPattern.test(e));
  const res = [];
  const refs = [];

  for (const name in rmap) {
    const { id } = rmap[name] ?? {};
    if (id != null) {
      refs.push(`;#hash ${name} ${id}`);
    }
  }

  if (/^;?#name/.test(lines[0])) {
    res.push(lines.shift());
    res.push(...refs);
  } else {
    res.push(...refs);
  }

  for (const line of lines) {
    res.push(line);
  }
  return res.join("\n");
}

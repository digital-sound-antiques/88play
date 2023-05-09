export type SampleEntry = {
  id: string;
  title: string;
  copyright?: string | null;
  license?: string | null;
  files: string[];
};

export type SampleSection = {
  id: string;
  title: string;
  copyright: string | null;
  license: string | null;
  folder: string;
  entries: SampleEntry[];
};

export const sampleSections: SampleSection[] = [
  {
    id: "mucom88",
    title: "MUCOM88 (MUSIC LALF)",
    folder: "mucom88",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "sample1",
        title: "Sample1",
        files: ["sampl1.muc", "voice.dat", "mucompcm.bin"],
      },
      {
        id: "sample2",
        title: "Sample2",
        files: ["sampl2.muc", "voice.dat"],
      },
      {
        id: "sample3",
        title: "Sample3",
        files: ["sampl3.muc", "voice.dat"],
      },
    ],
  },
  {
    id: "actraiser",
    title: "Actraiser",
    folder: "ACTRAISER_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "gh002",
        title: "Fillmore",
        files: ["gh002.muc", "actpcm.bin", "actvoice.dat"],
      },
      {
        id: "gh011",
        title: "Blood Pool ~ Casandora",
        files: ["gh011.muc", "actpcm.bin", "actvoice.dat"],
      },
      {
        id: "gh029",
        title: "Sacrifices",
        files: ["gh029.muc", "actpcm.bin", "actvoice.dat"],
      },
      {
        id: "stg001",
        title: "Space Fight",
        files: ["stg001.muc", "actpcm.bin", "actvoice.dat"],
      },
    ],
  },
  {
    id: "algarna",
    title: "Algarna",
    folder: "ALGARNA_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "arg006",
        title: "Sarun's Castle",
        files: ["arg006.muc"],
      },
      {
        id: "arg007",
        title: "Town of Valenzt",
        files: ["arg007.muc"],
      },
      {
        id: "arg011",
        title: "Mount Patron",
        files: ["arg011.muc"],
      },
      {
        id: "arg014",
        title: "Town of Karakum",
        files: ["arg014.muc"],
      },
    ],
  },
  {
    id: "bare1",
    title: "Bare Knuckle",
    folder: "BARE1_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "stk004",
        title: "Fighting in the Street",
        files: ["stk004.muc", "stkpcm.bin", "stkvoice.dat"],
      },
      {
        id: "stk013",
        title: "Attack the Barbarian",
        files: ["stk013.muc", "stkpcm.bin", "stkvoice.dat"],
      },
      {
        id: "stk020",
        title: "Stealthy Steps",
        files: ["stk020.muc", "stkpcm.bin", "stkvoice.dat"],
      },
      {
        id: "stk023",
        title: "The Street of Rage",
        files: ["stk023.muc", "stkpcm.bin", "stkvoice.dat"],
      },
      {
        id: "stk027",
        title: "Moon Beach",
        files: ["stk027.muc", "stkpcm.bin", "stkvoice.dat"],
      },
    ],
  },
  {
    id: "bare2",
    title: "Bare Knuckle 2",
    folder: "BARE2_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "bare03",
        title: "Go Straight",
        files: ["bare03.muc", "bare2pcm.bin", "bare2voice.dat"],
      },
      {
        id: "bare04",
        title: "Never Return Alive",
        files: ["bare04.muc", "bare2pcm.bin", "bare2voice.dat"],
      },
      {
        id: "bare09",
        title: "Too Deep",
        files: ["bare09.muc", "bare2pcm.bin", "bare2voice.dat"],
      },
      {
        id: "bare12",
        title: "Round Clear",
        files: ["bare12.muc", "bare2pcm.bin", "bare2voice.dat"],
      },
      {
        id: "bare16",
        title: "Dreamer",
        files: ["bare16.muc", "bare2pcm.bin", "bare2voice.dat"],
      },
      {
        id: "bare21",
        title: "Alien Power",
        files: ["bare21.muc", "bare2pcm.bin", "bare2voice.dat"],
      },
      {
        id: "bare75",
        title: "Expander",
        files: ["bare75.muc", "bare2pcm.bin", "bare2voice.dat"],
      },
    ],
  },
  {
    id: "bosconian",
    title: "Bosconian",
    folder: "BOSCONIAN_YK2_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "bos010",
        title: "Blast Power!",
        files: ["bos010.muc", "bosco_pcm.bin", "voice.dat"],
      },
      {
        id: "bos011",
        title: "Flash Flash Flash",
        files: ["bos011.muc", "bosco_pcm.bin", "voice.dat"],
      },
    ],
  },
  {
    id: "etrian",
    title: "Etrian Odyssey",
    folder: "Etrian_Odyssey",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "sq1_103",
        title: "The Green Green Woodlands",
        files: ["sq1_103.muc", "sq1pcm.bin", "voice.dat"],
      },
      {
        id: "sq1_104",
        title: "Initial Strike",
        files: ["sq1_104.muc", "sq1pcm.bin", "voice.dat"],
      },
      {
        id: "sq1_112",
        title: "Dyed in Blood",
        files: ["sq1_112.muc", "sq1pcm.bin", "voice.dat"],
      },
      {
        id: "sq1_115",
        title: "Destruction Begets Decay",
        files: ["sq1_115.muc", "sq1pcm.bin", "voice.dat"],
      },
      {
        id: "sq1_out06",
        title: "Battlefield's Awakening",
        files: ["sq1_out06.muc", "sq1pcm.bin", "voice.dat"],
      },
    ],
  },
  {
    id: "misty",
    title: "MISTY BLUE",
    folder: "MISTY_BLUE_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "disco1",
        title: "Misty Blue",
        files: ["disco1.muc", "mistypcm.bin", "mistyvoice.dat"],
      },
      {
        id: "disco3",
        title: "Catch the step",
        files: ["disco3.muc", "mistypcm.bin", "mistyvoice.dat"],
      },
      {
        id: "disco4",
        title: "Hold me tonight",
        files: ["disco4.muc", "mistypcm.bin", "mistyvoice.dat"],
      },
      {
        id: "hrock1",
        title: "Opening",
        files: ["hrock1.muc", "mistypcm.bin", "mistyvoice.dat"],
      },
    ],
  },
  {
    id: "slap",
    title: "Slap Fight (MD)",
    folder: "SLAP_FIGHT_MD_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "slp005b",
        title: "Hishou -Flight-",
        files: ["slp005b.muc", "mucompcm.bin", "voice.dat"],
      },
      {
        id: "slp010",
        title: "Sakusen -Tactics-",
        files: ["slp010.muc", "mucompcm.bin", "voice.dat"],
      },
      {
        id: "slp020",
        title: "Kibou -Hope-",
        files: ["slp020.muc", "mucompcm.bin", "voice.dat"],
      },
    ],
  },
  {
    id: "scheme",
    title: "The Scheme",
    folder: "THE_SCHEME_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "pcmt12",
        title: "I'LL SAVE YOU ALL MY JUSTICE",
        files: ["pcmt12.muc", "schemepcm.bin", "scmvoice.dat"],
      },
      {
        id: "pcmt13",
        title: "PERPETUAL DARK!",
        files: ["pcmt13.muc", "schemepcm.bin", "scmvoice.dat"],
      },
      {
        id: "pcmt16",
        title: "SHOUT DOWN",
        files: ["pcmt16.muc", "schemepcm.bin", "scmvoice.dat"],
      },
      {
        id: "pcmt17",
        title: "THOUSAND EYES",
        files: ["pcmt17.muc", "schemepcm.bin", "scmvoice.dat"],
      },
      {
        id: "pcmt18",
        title: "DEATH WORLD",
        files: ["pcmt18.muc", "schemepcm.bin", "scmvoice.dat"],
      },
      {
        id: "pcmt20",
        title: "THE FORCE ROTTED AWAY",
        files: ["pcmt20.muc", "schemepcm.bin", "scmvoice.dat"],
      },
      {
        id: "pcmt31",
        title: "CHALLENGING TOMORROW	",
        files: ["pcmt31.muc", "schemepcm.bin", "scmvoice.dat"],
      },
      {
        id: "pcmt16d2",
        title: "SHOUT DOWN (Arranged ver.)",
        files: ["pcmt16d2.muc", "dr_pcm.bin", "dr_voice.dat"],
      },
    ],
  },
  {
    id: "shinobi",
    title: "The Super Shinobi",
    folder: "THE_SUPER_SHINOBI_MML",
    copyright: "Yuzo Koshiro",
    license: "CC BY-NC-ND 4.0",
    entries: [
      {
        id: "sin002",
        title: "THE SHINOBI",
        files: ["sin002.muc", "shinobipcm.bin", "shinobivoice.dat"],
      },
      {
        id: "sin008",
        title: "CHINA TOWN",
        files: ["sin008.muc", "shinobipcm.bin", "shinobivoice.dat"],
      },
      {
        id: "sin013",
        title: "LIKE A WIND",
        files: ["sin013.muc", "shinobipcm.bin", "shinobivoice.dat"],
      },
      {
        id: "sin014",
        title: "SUNRISE BLVD.",
        files: ["sin014.muc", "shinobipcm.bin", "shinobivoice.dat"],
      },
    ],
  },
];

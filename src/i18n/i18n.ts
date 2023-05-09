import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const detector = new LanguageDetector(null, {
  order: ['querystring', 'cookie',  'navigator', 'localStorage', 'htmlTag'],
  htmlTag: document.documentElement,
});

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          urls: {
            mmlReference:
              "https://github.com/onitama/mucom88/wiki/MMLReference",
          },
          share: {
            message: "Please copy and share the link below.",
            unresolvedMessage:
              "{{file}} must be resolved before sharing. If the file is not needed, please remove #{{tag}} tag from the MML.",
          },
          alert: {
            unresolvedResources: {
              message_one:
                "Unresolved: {{file}}. Open or drop it to the editor.",
              message_other:
                "Unresolved: {{file}}. Open or drop them to the editor.",
              buttonLabel: "Open...",
            },
          },
        },
      },
      ja: {
        translation: {
          urls: {
            mmlReference:
              "https://github.com/onitama/mucom88/wiki/MML%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9",
          },
          share: {
            message: "次のURLをコピーしてシェアしてください。",
            unresolvedMessage:
              "{{file}}が見つからないため、シェアできません。ファイルの参照が不要な場合は、MMLから#{{tag}}タグを削除してください。",
          },
          alert: {
            unresolvedResources: {
              message:
                "{{file}}が見つかりません。ファイルを開く、またはエディタにドロップしてください。",
              buttonLabel: "開く...",
            },
          },
        },
      },
    },
  });

export default i18n;

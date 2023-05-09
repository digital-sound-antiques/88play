ace.define(
  "ace/mode/mucom_highlight_rules",
  function (require, exports, module) {
    const oop = require("ace/lib/oop");
    const TextHighlightRules =
      require("ace/mode/text_highlight_rules").TextHighlightRules;
    const HighlightRules = function () {
      this.$rules = {
        start: [
          {
            token: "comment",
            regex: /;.*$/,
          },
          {
            token: "mmltag",
            regex: /^#[a-zA-Z0-9-_:.]+/,
            next: "mmltagValue",
          },
          {
            token: "line-number",
            regex: /^[0-9]+\s*/,
          },
          {
            token: "channel",
            regex: /'?([A-K]\s|#)/,
            next: "mml",
          },
        ],
        mmltagValue: [
          {
            token: "mmltag-value",
            regex: /.*$/,
            next: "start",
          },
        ],
        mml: [
          {
            token: "comment",
            regex: /;.*$/,
            next: "start",
          },
          {
            token: "mml-jump",
            regex: "[LJ]",
          },
          {
            token: "mml-looping",
            regex: /(\[|\/|\][0-9]+)/,
          },
          {
            token: "mml-bracket",
            regex: /[{}]/,
          },
          {
            token: "mml-macro",
            regex: /\*[0-9]+/,
          },
          {
            token: "mml-rel-octave",
            regex: /[<>]/,
          },
          {
            token: "mml-rel-volume",
            regex: /[()][0-9]*/,
          },
          {
            token: "mml-command",
            regex: /([CtTovqplDLKVksHMRSEPwsm]|R[Fm]|M[FWCLD])-?(\$[0-9a-fA-F]+|[0-9]+)(,-?(\$[0-9a-fA-F]+|[0-9]+))*/,
          },
          {
            token: "mml-command",
            regex: /y(DM|TL|KA|DR|SR|SL|SE)?(,(\$[0-9A-Fa-f]+|[0-9]+))+/,
          },
          {
            token: "mml-command",
            regex: /\\=[0-9]+(,[0-9]+)?/,
          },
          {
            token: "mml-command",
            regex: /(vm|[:!|\\])/,
          },
          {
            token: "mml-command",
            regex: /\s%[0-9]+/,
          }, {
            token: "mml-command",
            regex: /@([0-9]+|"[^"]+")/,
          },
          {
            token: "eol",
            regex: "$",
            next: "start",
          },
        ],
      };
    };
    oop.inherits(HighlightRules, TextHighlightRules);
    exports.MUCOMHighlightRules = HighlightRules;
  }
);

ace.define("ace/mode/mucom", function (require, exports, module) {
  const oop = require("ace/lib/oop");
  const TextMode = require("ace/mode/text").Mode;
  // let MatchingBraceOutdent = require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
  const Mode = function () {
    this.HighlightRules =
      require("ace/mode/mucom_highlight_rules").MUCOMHighlightRules;
    // this.$outdent = new MatchingBraceOutdent();
  };
  oop.inherits(Mode, TextMode);
  (function () {
    // Extra logic goes here.
  }).call(Mode.prototype);
  exports.Mode = Mode;
});

const THEME_PATH = "ace/theme/mucom";
ace.define(THEME_PATH, function (require, exports, module) {
  exports.isDark = true;
  exports.cssClass = "ace_mucom";
  exports.cssText = `
  .ace_editor.ace_mucom {
    color: #efebe9;
    background-color: #1f1b19;
  }
  .ace_marker-layer .ace_bracket {
    margin: -1px 0 0 -1px;
    background-color: #bfbfbf;
  }
  .ace_marker-layer .ace_active-line {
    background-color: rgba(255,255,255,0.14);
  }
  .ace_gutter-active-line {
    background-color: rgba(255,255,255,0.14);
  }
  .ace_line-number {
    color: #808080;
  }
  .ace_comment {
    color: #999;
  }
  .ace_mmltag {
    color: #ee0;
  }
  .ace_mml-bracket {
    color: #999;
  }
  .ace_mml-looping {
    color: #8ef;
  }
  .ace_mml-rel-octave, .ace_mml-rel-volume {
    color: #999;
  }
  .ace_mml-macro {
    color: #e8e;
  }
  .ace_mml-command {
    color: #beb;
  }
  .ace_mml-jump {
    color: #e88;
  }
  .ace_channel {
    color: #4ef;
  }
  .ace_jump {
    color: #ff0;
  }
  .ace_selection {
    background-color: rgba(88,172,247,0.5);
  }
  .ace_selected-word {
    background-color: #666;
  }
  .ace_gutter {
    background-color: #000;
  }
`;
  const dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});

(function () {
  ace.require(["ace/mode/mucom"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();

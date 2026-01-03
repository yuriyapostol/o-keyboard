import * as lettersEn from '../../tables/characters/en.js';
import * as lettersUk from '../../tables/characters/uk.js';
import * as numbers from '../../tables/characters/numbers.js';
import * as morseItu from '../../tables/morse-codes/itu.js';
import * as morseUkLegal from '../../tables/morse-codes/uk-legal.js';
import * as phoneticNato from '../../tables/phonetic-alphabets/nato.js';
import * as phoneticUk from '../../tables/phonetic-alphabets/uk.js';

export const layout = {
  type: "morse",
  family: "morse-phonetic",
  name: "en-uk",
  title: "Morse Code + Phonetic Alphabet: English + Ukrainian, QWERTY",
  layers: [
    {
      name: "default",
      labels: [
        { labelTable: ["characters/en", "characters/numbers"], case: "upper", valueTable: "morse-code/itu" },
        { labelTable: ["characters/uk", "characters/numbers"], position: 2, size: 0.8, case: "upper", valueTable: "morse-code/uk-legal" },
        { labelTable: "phonetic-alphabet/nato", position: 7, size: 0.6, direction: "column" },
      ],
      keys: [
        { key: "1", labels: [null, ""], row: 0 },
        { key: "2", row: 0 },
        { key: "3", row: 0 },
        { key: "4", row: 0 },
        { key: "5", row: 0 },
        { key: "6", row: 0 },
        { key: "7", row: 0 },
        { key: "8", row: 0 },
        { key: "9", row: 0 },
        { key: "0", row: 0 },
        { key: "w", row: 1 },
        { key: "e", row: 1 },
        { key: "r", row: 1 },
        { key: "t", row: 1, hilighted: true },
        { key: "y", row: 1 },
        { key: "u", row: 1 },
        { key: "i", row: 1 },
        { key: "o", row: 1 },
        { key: "p", row: 1 },
        { key: "a", row: 2, hilighted: true },
        { key: "s", row: 2, hilighted: true },
        { key: "d", row: 2 },
        { key: "f", row: 2, hilighted: true },
        { key: "g", row: 2 },
        { key: "h", row: 2 },
        { key: "j", row: 2 },
        { key: "k", row: 2 },
        { key: "l", row: 2 },
        { key: "z", row: 3 },
        { key: "x", row: 3 },
        { key: "c", row: 3 },
        { key: "v", row: 3 },
        { key: "b", row: 3 },
        { key: "n", labels: [null, null, ["Novem-", "ber"]], row: 3 },
        { key: "m", row: 3, disabled: true },
      ],
    },
  ],
  tables: [
    lettersEn.table,
    lettersUk.table,
    numbers.table,
    morseItu.table,
    morseUkLegal.table,
    phoneticNato.table,
    phoneticUk.table
  ]
};

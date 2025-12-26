import * as lettersEn from '../tables/letters/en.js';
import * as lettersUk from '../tables/letters/uk.js';
import * as morseItu from '../tables/morse-codes/itu.js';
import * as morseUkLegal from '../tables/morse-codes/uk-legal.js';
import * as phoneticNato from '../tables/phonetic-alphabets/nato.js';
import * as phoneticUk from '../tables/phonetic-alphabets/uk.js';

export const layout = {
  name: "uk-en",
  title: "Morse Code + Phonetic Alphabet: Ukrainian + English, QWERTY",
  labels: [
    { valueTable: "letter/uk", case: "upper", codeTable: "morse-code/uk-legal" },
    { valueTable: "letter/en", position: 2, size: 0.8, case: "upper", codeTable: "morse-code/itu" },
    { valueTable: "phonetic-alphabet/uk", position: 7, size: 0.6 },
  ],
  keys: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["й", "ц", "у", "к", "е", "н", ["г", "ґ"], "ш", "щ", "з", "х"],
    ["ф", ["і", "ї"], "в", "а", "п", "р", "о", "л", "д", "ж", "є"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"],
  ],
  hilightedKeys: ["а", "ф", "с", "т"],
  tables: [
    lettersEn.table,
    lettersUk.table,
    morseItu.table,
    morseUkLegal.table,
    phoneticNato.table,
    phoneticUk.table
  ]
};

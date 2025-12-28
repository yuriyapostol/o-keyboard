import * as lettersUk from '../../tables/letters/uk.js';

export const layout = {
  name: "uk-letters",
  title: "Українська",
  labels: [
    { valueTable: "letter/uk", case: "upper" },
  ],
  keys: [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ї"],
    ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є", "ґ"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "."],
  ],
  //hilightedKeys: ["а", "ф", "с", "т"],
  tables: [
    lettersUk.table,
  ]
};

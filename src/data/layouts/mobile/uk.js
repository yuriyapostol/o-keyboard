import * as lettersUk from '../../tables/characters/uk.js';
import * as typographical from '../../tables/characters/typographical.js';

export const layout = {
  type: "mobile",
  family: "mobile",
  name: "uk",
  title: "Українська",
  labels: [
    { labelTable: ["characters/uk", "characters/typographical"], case: "upper" },
  ],
  keys: [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ї"],
    ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є", "ґ"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "."],
    ["space"]
  ],
  //hilightedKeys: ["а", "ф", "с", "т"],
  tables: [
    lettersUk.table,
    typographical.table
  ]
};

export const layout = {
  name: "uk-en",
  title: "Morse Code + Phonetic Alphabet: Ukrainian + English, QWERTY",
  labels: [
    { type: "letter", table: "uk" },
    { type: "letter", table: "itu", position: 2, size: 1 },
    { type: "phonetic-alphabet", name: "uk", position: 7, size: 0.6 },
  ],
  keys: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["й", "ц", "у", "к", "е", "н", [["г", "ґ"]], "ш", "щ", "з", "х"],
    ["ф", [["і", "ї"]], "в", "а", "п", "р", "о", "л", "д", "ж", "є"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"],
  ],
  hilightedKeys: ["а", "ф", "с", "т"],
};

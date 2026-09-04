import type { Flavor } from './types';

const raw: Array<[string, string, Flavor['family'], string]> = [
  ['Migdał', 'Almond', 'deserowe', '🌰'], ['Jabłko', 'Apple', 'owocowe', '🍏'],
  ['Acerola', 'Acerola', 'owocowe', '🍒'], ['Jagody acai', 'Acai Berry', 'owocowe', '🫐'],
  ['Banan i truskawka', 'Banana & Strawberry', 'owocowe', '🍓'], ['Owoce jagodowe', 'Berry Blend', 'owocowe', '🫐'],
  ['Czarna porzeczka', 'Blackcurrant', 'owocowe', '🫐'], ['Jagoda', 'Blueberry', 'owocowe', '🫐'],
  ['Banan', 'Banana', 'owocowe', '🍌'], ['Marchewka i pomarańcza', 'Carrot & Orange', 'cytrusowe', '🥕'],
  ['Wiśnia', 'Cherry', 'owocowe', '🍒'], ['Kola wiśniowa', 'Cherry Kola', 'inne', '🥤'],
  ['Chilli', 'Chilli', 'inne', '🌶️'], ['Cynamon', 'Cinnamon', 'deserowe', '🤎'],
  ['Kokos', 'Coconut', 'egzotyczne', '🥥'], ['Żurawina', 'Cranberry', 'owocowe', '🔴'],
  ['Ogórek', 'Cucumber', 'inne', '🥒'], ['Smoczy owoc', 'Dragon Fruit', 'egzotyczne', '🐉'],
  ['Owoce egzotyczne', 'Exotic', 'egzotyczne', '🌴'], ['Owoc czarnego bzu', 'Elderberry', 'owocowe', '🫐'],
  ['Kwiat czarnego bzu', 'Elderflower', 'inne', '🌼'], ['Owoce leśne', 'Forest Fruits', 'owocowe', '🌲'],
  ['Imbir', 'Ginger', 'inne', '🫚'], ['Żółty grejpfrut', 'Yellow Grapefruit', 'cytrusowe', '🍊'],
  ['Owoc gravioli', 'Guanabana', 'egzotyczne', '🌿'], ['Guarana', 'Guarana', 'egzotyczne', '⚡'],
  ['Guawa', 'Guava', 'egzotyczne', '🌴'], ['Jagody goji', 'Goji Berry', 'owocowe', '🔴'],
  ['Tonik grejpfrutowy', 'Grapefruit Tonic', 'cytrusowe', '🍹'], ['Melon', 'Honey Melon', 'owocowe', '🍈'],
  ['Hibiskus', 'Hibiscus', 'inne', '🌺'], ['Miód', 'Honey', 'deserowe', '🍯'],
  ['Kiwi', 'Kiwi', 'owocowe', '🥝'], ['Kola', 'Kola', 'inne', '🥤'],
  ['Cytryna', 'Lemon', 'cytrusowe', '🍋'], ['Liczi', 'Lychee', 'egzotyczne', '🌸'],
  ['Limonka', 'Lime', 'cytrusowe', '🍋‍🟩'], ['Trawa cytrynowa', 'Lemongrass', 'cytrusowe', '🌾'],
  ['Ciasto cytrynowe', 'Lemon Pie', 'deserowe', '🥧'], ['Lemoniada', 'Lemonade', 'cytrusowe', '🍋'],
  ['Cytryna z chilli', 'Lemon Chilli', 'cytrusowe', '🌶️'], ['Tonik cytrynowy', 'Lemon Tonic', 'cytrusowe', '🍹'],
  ['Mandarynka', 'Mandarin', 'cytrusowe', '🍊'], ['Mango', 'Mango', 'egzotyczne', '🥭'],
  ['Multiwitamina', 'Multivitamin', 'owocowe', '🌈'], ['Mięta', 'Mint', 'inne', '🌿'],
  ['Mojito', 'Mojito', 'inne', '🍹'], ['Mango z chilli', 'Mango Chilli', 'egzotyczne', '🌶️'],
  ['Pomarańcza', 'Orange', 'cytrusowe', '🍊'], ['Papaja', 'Papaya', 'egzotyczne', '🧡'],
  ['Marakuja', 'Passionfruit', 'egzotyczne', '💜'], ['Brzoskwinia', 'Peach', 'owocowe', '🍑'],
  ['Gruszka', 'Pear', 'owocowe', '🍐'], ['Ananas', 'Pineapple', 'egzotyczne', '🍍'],
  ['Granat', 'Pomegranate', 'owocowe', '🔴'], ['Śliwka', 'Plum', 'owocowe', '🟣'],
  ['Panna cotta', 'Panna Cotta', 'deserowe', '🍮'], ['Piña colada', 'Pina Colada', 'egzotyczne', '🍹'],
  ['Malina', 'Raspberry', 'owocowe', '🫐'], ['Czerwone winogrono', 'Red Grape', 'owocowe', '🍇'],
  ['Róża', 'Rose', 'inne', '🌹'], ['Czerwona pomarańcza', 'Red Orange', 'cytrusowe', '🍊'],
  ['Rum', 'Rum', 'inne', '🥃'], ['Czerwona sangria', 'Red Sangria', 'inne', '🍷'],
  ['Truskawka', 'Strawberry', 'owocowe', '🍓'], ['Tamarynd', 'Tamarind', 'egzotyczne', '🫘'],
  ['Pomidor', 'Tomato', 'inne', '🍅'], ['Tonik', 'Tonic', 'inne', '🫧'],
  ['Wanilia', 'Vanilla', 'deserowe', '🤍'], ['Przytulia wonna', 'Waldmeister', 'inne', '🌿'],
  ['Arbuz', 'Watermelon', 'owocowe', '🍉'], ['Białe winogrono', 'White Grape', 'owocowe', '🍇'],
  ['Jogurt', 'Yoghurt', 'deserowe', '🥛'], ['Mrożona herbata cytrynowa', 'Ice Tea Lemon', 'cytrusowe', '🧊'],
  ['Mrożona herbata brzoskwiniowa', 'Ice Tea Peach', 'owocowe', '🧊'], ['Mrożona herbata marakuja', 'Ice Tea Passionfruit', 'egzotyczne', '🧊'],
  ['Izotonik pomarańczowy', 'Sport', 'inne', '🏃']
];

// Flavors shared by the 7 g and 14 g ranges: https://bolero.pl/energy/bolero-energy-7g
const energy: Array<[string, string, string]> = [
  ['Original', 'Original', '🥤'], ['Power Punch', 'Power Punch', '🥊'],
  ['Tropical Punch', 'Tropical Punch', '🌴'], ['Blue', 'Blue', '🔵'],
  ['Brzoskwinia i nektarynka', 'Peach&Nectarine', '🍑'], ['Mixed Punch', 'Mixed Punch', '🍹'],
  ['Pacific Punch', 'Pacific Punch', '🌊'], ['Mrożona zielona herbata', 'Green Iced Tea', '🍵'],
  ['Jabłko', 'Apple', '🍏'], ['Kola', 'Kola', '🥤'],
  ['Exotic Punch', 'Exotic Punch', '🌴'], ['Truskawka', 'Strawberry', '🍓'],
  ['Czerwone winogrono', 'Red Grape', '🍇'], ['Mrożona herbata brzoskwiniowa', 'Iced Tea Peach', '🍑'],
  ['Mrożona herbata cytrynowa', 'Iced Tea Lemon', '🍋'], ['Mango', 'Mango', '🥭'],
  ['Arbuz', 'Watermelon', '🍉'], ['Ananas', 'Pineapple', '🍍'],
  ['Kiwi, limonka i ogórek', 'Kiwi-Lime&Cucumber', '🥝'], ['Imbir i limonka', 'Ginger&Lime', '🫚']
];

const slug = (value: string) => value.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const flavors: Flavor[] = [
  ...raw.map(([name, original, family, emoji]) => ({ id: slug(original), name, original, family, emoji })),
  ...energy.map(([name, original, emoji]): Flavor => ({
    id: slug(`Energy ${original}`), name: `⚡ ${name}`, original: `Energy ${original}`,
    family: 'energetyki', emoji
  }))
];

export const getFlavorName = (flavor: Flavor) =>
  flavor.family === 'energetyki' ? `⚡ ${flavor.original.replace(/^Energy /, '')}` : flavor.original;

export const familyLabels: Record<Flavor['family'], string> = {
  owocowe: 'Owocowe', cytrusowe: 'Cytrusowe', egzotyczne: 'Egzotyczne', deserowe: 'Deserowe', inne: 'Inne', energetyki: '⚡ Energetyki'
};

export const getShopUrl = (flavor: Flavor) =>
  `https://bolero.pl/catalogsearch/result/?q=${encodeURIComponent(flavor.original)}`;

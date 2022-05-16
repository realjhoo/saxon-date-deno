// --------------------------------------------------------
export const getDayName = (index: number): string => {
  return [
    "Sunnandaeg",
    "Monandaeg",
    "Tiwesdaeg",
    "Wodnesdaeg",
    "Thunresdaeg",
    "Frigedaeg",
    "Saeternesdaeg",
  ][index];
};

// --------------------------------------------------------
export const getSaxonMonthName = (index: number): string => {
  return [
    "Afteryule",
    "Solmonath",
    "Hrethmonath",
    "Eastermonath",
    "Thrimilce",
    "Erelitha",
    "Afterlitha",
    "Trilitha",
    "Weedmonath",
    "Haligmonath",
    "Winterfylleþ",
    "Blotmonath",
    "Ereyule",
  ][index];
};

// --------------------------------------------------------
export function getJulianDay(
  date: number,
  month: number,
  year: number
): number {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let JD =
    date +
    Math.floor((153 * m + 2) / 5) +
    y * 365 +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  return JD;
}

// saxon-date exectable project app using deno
"use strict";

//---------------------------------------------------------
import {
  getDayName,
  getJulianDay as getJulianDate,
  getSaxonMonthName,
} from "./shared_functions.ts";

import metonicData from "./data/metonicTables.json" assert { type: "json" };

let verbose: boolean = false;

// --------------------------------------------------------
function isDST(date: Date): boolean {
  // DST means Daylight Savings Time
  let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) != date.getTimezoneOffset();
}

// --------------------------------------------------------
function getDayNumber(date: Date): number {
  // returns 1-366 (day of the year)
  // corrects for Daylight Savings Time
  let DST = isDST(date);
  if (DST) {
    return Math.ceil(
      (+date - +new Date(date.getFullYear(), 0, 1, -1, 0, 0, 0)) / 86400000
    );
  } else {
    return Math.ceil(
      (+date - +new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0)) / 86400000
    );
  }
}

// --------------------------------------------------------
function getRunicYear(saxonMonth: string, gregorianDate: Date): number {
  const January = 1;
  const December = 12;
  let gregorianYear = gregorianDate.getFullYear();
  let gregorianMonth = gregorianDate.getMonth() + 1;
  let saxonYear = 0;

  if (saxonMonth === "Ereyule" && gregorianMonth === January) {
    saxonYear = gregorianYear + 249;
  } else if (saxonMonth === "Afteryule" && gregorianMonth === December) {
    saxonYear = gregorianYear + 251;
  } else {
    saxonYear = gregorianYear + 250;
  }
  return saxonYear;
}

// --------------------------------------------------------
function getGoldenNumber(year: number): number {
  return (year % 19) + 1;
}

// --------------------------------------------------------
function getSaxonDate(metonicDate: object, now: string): void {
  // let gregorianToday = new Date("2022-12-24");
  let gregorianToday = new Date(now);
  let gregorianYear = gregorianToday.getFullYear();
  let goldenNumber = getGoldenNumber(gregorianYear);
  let dayNumber = getDayNumber(gregorianToday);

  let gDate = gregorianToday.getDate();
  let gMonth = gregorianToday.getMonth();
  let gYear = gregorianToday.getFullYear();

  let i = 0;
  let monthStart = 0;
  let monthLength = 0;
  let saxonMonthNum = 0;
  let length = Object.keys(
    eval(`metonicData.MetonicTable${goldenNumber}`)
  ).length;

  while (
    eval(`metonicData.MetonicTable${goldenNumber}[i].Start`) <= dayNumber
  ) {
    monthLength = eval(`metonicData.MetonicTable${goldenNumber}[i].Stop`);
    monthStart = eval(`metonicData.MetonicTable${goldenNumber}[i].Start`);
    saxonMonthNum = parseInt(
      eval(`metonicData.MetonicTable${goldenNumber}[i].moon`)
    );

    // this line updated to correct error, not recompiled
    i++;
    if (i > length - 1) {
      break;
    }
  }

  let day = getDayName(gregorianToday.getDay());
  let saxonDay = dayNumber - monthStart + 1;
  let saxonMonth = getSaxonMonthName(saxonMonthNum);
  let runicYear = getRunicYear(saxonMonth, gregorianToday);
  let saxonDate = `${day} ${saxonDay} ${saxonMonth} ${runicYear}`;

  let output: string;

  if (verbose) {
    output = `
  Verbose Output Follows:
  Gregorian Date: ${gregorianToday}
  Julian Date: ${getJulianDate(gDate, gMonth, gYear)}
  Daylight Savings Time is ${isDST(gregorianToday)}
  Golden Number: ${goldenNumber}
  Today's Day Number: ${dayNumber}
  Month Start: ${monthStart}
  Length of Month: ${monthLength}
  Today is a ${day}
  Saxon Day: ${saxonDay}
  Saxon Month: ${saxonMonth}
  Saxon Year: ${runicYear}
  Saxon Date: ${saxonDate}
  `;
  } else {
    output = `
    Saxon Date: ${saxonDate}
    `;
  }

  console.log(output);
}

// --------------------------------------------------------
function main(): void {
  if (Deno.args.length) {
    // are there any dates?
    for (let i = 0; i < Deno.args.length; i++) {
      if (Date.parse(Deno.args[i]) && Deno.args.includes("--verbose")) {
        verbose = true;
        getSaxonDate(metonicData, Deno.args[i]);
        break;
      } else if (Date.parse(Deno.args[i])) {
        getSaxonDate(metonicData, Deno.args[i]);
        // verbose only
      } else if (Deno.args.includes("--verbose")) {
        verbose = true;
        let today = new Date().toString();
        getSaxonDate(metonicData, today);
        break;
      }
      if (
        !Deno.args.includes("--verbose") &&
        !Deno.args.includes("--help") &&
        !Deno.args.includes("--about") &&
        !Date.parse(Deno.args[i])
      ) {
        let msg: string = `
try using "--help"
      `;
        console.log(msg);
      }
    }

    if (Deno.args.includes("--help")) {
      let helpmsg: string = `
    • To see today's Saxon Date, enter 'saxon-date' at the
       prompt with no arguments
    • To see the Saxon Date for a specific Gregorian date,
       enter the date in any valid format, such as,
       yyyy-mm-dd or d-mm-yyyy
       For example: saxon-date 1975.08.05
    • Use the --verbose flag to see extra information
    • Use the --help flag to see this message
    `;
      console.log(helpmsg);
    }

    if (Deno.args.includes("--about")) {
      let msg: string = `
This version of saxon-date was written in Typescript using Deno.
    `;
      console.log(msg);
    }
  } else {
    const today = new Date().toString();
    getSaxonDate(metonicData, today);
  }
}

// --------------------------------------------------------
//process args here
main();

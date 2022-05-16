// saxon-date exectable project app using deno
"use strict";

//---------------------------------------------------------
import {
  getDayName,
  getJulianDay as getJulianDate,
  // initToggleButton,
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
// function showSaxonDate(saxonDate: string): void {
//   let output = document.querySelector(".saxon-date") as HTMLParagraphElement;
//   output.innerHTML = saxonDate;
// }

// --------------------------------------------------------
function getFirstDay(monthStart: number, gregorianYear: number): number {
  // finds day of week of 1st day of lunar month
  let jd = getJulianDate(0, 1, gregorianYear) + monthStart;
  let dowNumber = (jd + 1) % 7;
  return dowNumber;
}

// --------------------------------------------------------
function getSaxonDate(metonicDate: object, when: string): void {
  // let gregorianToday = new Date("2022-12-24");
  let gregorianToday = new Date(when);
  let gregorianYear = gregorianToday.getFullYear();
  let goldenNumber = getGoldenNumber(gregorianYear);
  let dayNumber = getDayNumber(gregorianToday);

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

    i++;
    if (i >= length - 1) {
      break;
    }
  }

  let day = getDayName(gregorianToday.getDay());
  let saxonDay = dayNumber - monthStart + 1;
  let saxonMonth = getSaxonMonthName(saxonMonthNum);

  let runicYear = getRunicYear(saxonMonth, gregorianToday);

  let saxonDate = `${day} ${saxonDay} ${saxonMonth} ${runicYear}`;

  // showSaxonDate(saxonDate);

  // let firstDay = getFirstDay(monthStart, gregorianYear);

  //showCalendar(monthLength, firstDay, runicYear, saxonMonth, saxonDay);
  let output: string;
  if (verbose) {
    output = `
  Verbose Output Follows:
  Gregorian Date: ${gregorianToday}
  Daylight Savings Time is ${isDST(gregorianToday)}
  Golden Number: ${goldenNumber}
  Today's Day Number: ${dayNumber}
  Month Start: ${monthStart}
  Length of Month: ${monthLength}
  Today is a ${day}
  Saxon Day: ${saxonDay}
  Saxon Month: ${saxonMonth}
  Saxon Year: ${runicYear}
  Saxon Date: ${saxonDate}`;
  } else {
    output = `
    Saxon Date: ${saxonDate}
    `;
  }

  console.log(output);

  // *** SOME LOG OUTS ***
  // console.clear();
  // console.log("%cOutput Follows:", "color: lightgreen");
  // console.log(gregorianToday);
  // console.log(`Daylight Savings Time is ${isDST(gregorianToday)}`);
  // console.log(`Golden Number: ${goldenNumber}`);
  // console.log("Today's Day Number", dayNumber);
  // console.log("Month Start: ", monthStart);
  // console.log("Length of Month: ", monthLength);
  // console.log(`Today is a ${day}`);
  // console.log(`Saxon Day: ${saxonDay}`);
  // console.log(`Saxon Month: ${saxonMonth}`);
  // console.log(`Saxon Year: ${runicYear}`);
  // console.log(`Saxon Date: ${saxonDate}`);
}

// --------------------------------------------------------
/*function showCalendar(
  daysInMonth: number,
  firstDay: number,
  saxonYear: number,
  saxonMonth: string,
  saxonDay: number
): void {
  // tbody and h3
  const calendarBody = document.getElementById("calendar-body")!;
  const monthYear = document.getElementById("month-year")!;

  // clear previous cells and set the calendar title
  calendarBody.innerHTML = "";
  monthYear.innerHTML = `${saxonMonth} ${saxonYear}`;

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay) {
        const cell = document.createElement("td");
        const cellText = document.createTextNode("");
        cell.appendChild(cellText);
        row.appendChild(cell);
      } else if (date > daysInMonth) {
        break;
      } else {
        const cell = document.createElement("td");
        const cellText = document.createTextNode(date.toString());
        if (date === saxonDay) {
          cell.classList.add("highlight-cell");
        }
        cell.appendChild(cellText);
        row.appendChild(cell);
        date++;
      }
    }

    calendarBody.appendChild(row);
  }
}
*/
// --------------------------------------------------------
function getMetonicData(): void {
  // fetch("js/data/metonicTables.json")
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error(response.statusText);
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     let metonicData = data;
  //     getSaxonDate(metonicData);
  //   });
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

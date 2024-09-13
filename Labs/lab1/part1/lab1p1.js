const lodash = require("lodash");

const holidays = [
  { name: "Christmas", Date: new Date("2024-12-25") },
  { name: "Boxing day", Date: new Date("2024-12-26") },
  { name: "New Year", Date: new Date("2025-01-01") },
  { name: "Birthday", Date: new Date("2025-04-01") },
];

const today = new Date();
holidays.forEach((holiday) => {
  const daysLeft = (holiday.Date - today) / (1000 * 60 * 60 * 24);
  console.log(`${holiday.name} is in ${Math.ceil(daysLeft)} days`);
});

console.log("Random holiday: ", lodash.sample(holidays));

console.log(
  "Index for Christmas" +
    " " +
    lodash.findIndex(holidays, { name: "Christmas" })
);

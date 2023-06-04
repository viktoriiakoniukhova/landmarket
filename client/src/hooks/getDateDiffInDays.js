export default function getDateDiffInDays(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Convert dates to timestamps
  const timestamp1 = date1.getTime();
  const timestamp2 = date2.getTime();

  // Calculate the difference in days
  const differenceInDays = Math.round(
    Math.abs((timestamp1 - timestamp2) / oneDay)
  );

  return differenceInDays;
}

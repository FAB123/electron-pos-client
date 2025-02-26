const colorList = (index) => {
  let list = ["success", "error", "info", "secondary"];
  return list[index];
};

function getLastMonths(n) {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var today = new Date();
  var lastMonths = [];

  for (let i = 0; i < n; i++) {
    const currentDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    lastMonths.push({
      month: monthNames[month],
      year: year,
      value: `${month + 1}/${year}`, // Month is zero-based, so add 1 for proper formatting
    });
  }
  return lastMonths;
}

export { colorList, getLastMonths };

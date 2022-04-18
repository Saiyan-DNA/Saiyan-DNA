export function addDays(date, days) {
    var result = date;
    result.setDate(result.getDate() + days);
    return result;
  }
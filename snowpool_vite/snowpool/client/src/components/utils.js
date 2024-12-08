// utils.js

export const getFirstPart = (str, delimiter = " ") => {
  const parts = str.split(delimiter);
  return parts[0];
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  // Add timezone offset
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

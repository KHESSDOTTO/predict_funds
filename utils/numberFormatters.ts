const formatterBrNumber = new Intl.NumberFormat("de-DE", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export { formatterBrNumber };

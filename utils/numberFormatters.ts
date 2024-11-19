const formatterBrNumber = new Intl.NumberFormat("de-DE", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatterBrInteger = new Intl.NumberFormat("de-DE", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatterPct = new Intl.NumberFormat("de-DE", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export {
  formatterBrInteger,
  formatterBrNumber,
  formatterPct,
};

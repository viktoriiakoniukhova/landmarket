export default function currencyFilter(value, currency = "UAH") {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: currency,
  }).format(value);
}

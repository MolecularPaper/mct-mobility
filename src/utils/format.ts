export function FormatPhoneNumber(value: string) {
  return FormatNumber(value.substring(0, 11)).replace(
    /^(\d{2,3})(\d{3,4})(\d{4})$/,
    `$1-$2-$3`,
  );
}

export function FormatNumber(value: string) {
  return value.replace(/[^0-9]/g, "");
}

// Number
export function FormatNumber(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function IsNumber(value: string) {
  return /^\d+$/.test(value);
}

// Phone Number
const phoneNumberRegex = /^(\d{2,3})(\d{3,4})(\d{4})$/;
export function FormatPhoneNumber(value: string) {
  return FormatNumber(value.substring(0, 11)).replace(
    phoneNumberRegex,
    `$1-$2-$3`,
  );
}

export function IsPhoneNumber(value: string) {
  return IsNumber(value) && phoneNumberRegex.test(value);
}

export function getKST() {
  const kstNow: Date = new Date();
  kstNow.setHours(kstNow.getHours() + 9);

  return kstNow;
}

export function getKSTIsoString(): string {
  return getKST().toISOString().slice(0, 16);
}

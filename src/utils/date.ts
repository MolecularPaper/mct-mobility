export function getKST() {
  const now: Date = new Date();
  const kstOffset: number = 9 * 60 * 60 * 1000;
  return new Date(now.getTime() + kstOffset);
}

export function getKSTIsoString(): string {
  return getKST().toISOString().slice(0, 16);
}

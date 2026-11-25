const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatEuro = (amount: number) => euro.format(amount);

export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

/** 850 → "850 m", 1530 → "1,5 km" */
export function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`;
}

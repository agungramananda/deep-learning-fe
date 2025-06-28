export function formatCurrency(amount: number | string | undefined): string {
  if (!amount || amount === 'N/A') return 'T/A';
  
  // Handle string amounts that might include currency symbols
  let numAmount = typeof amount === 'string' 
    ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) 
    : amount;
    
  if (isNaN(numAmount)) return amount.toString();
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(numAmount);
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr || dateStr === 'N/A') return 'T/A';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}
export class FormatUtil {
  static formatCurrency(value: number, currency: string = '$'): string {
    return `${currency} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  static formatDate(date: string | Date, format: string = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
    } as any;
    return dateObj.toLocaleDateString('es-ES', options[format]);
  }

  static formatNumber(value: number, decimals: number = 0): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  static truncate(text: string, length: number = 50): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
}

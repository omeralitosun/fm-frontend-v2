export class Util {
    static formatCurrency(value: number, currency: string): string {
        return value.toLocaleString('en-TR', { style: 'currency', currency: 'TRY' });
    }

    static formatDate(date: Date): string {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }
}
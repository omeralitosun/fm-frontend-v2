import { Unit } from "@/constants/Unit";

export class Util {
    static formatCurrency(value: number, currency: string): string {
        return value.toLocaleString('en-TR', { style: 'currency', currency: 'TRY' });
    }

    static formatQuantity(value: number, unit?: string): string {
    const hasDecimal = value % 1 !== 0;

    const formatted = value.toLocaleString('tr-TR', {
        minimumFractionDigits: hasDecimal ? 1 : 0,
        maximumFractionDigits: hasDecimal ? 3 : 0
    });

    return unit ? `${formatted} ${unit}` : formatted;
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

    static getUnits(): Unit[] {
            return Unit.values();
    }
}
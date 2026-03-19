export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}
export function formatNumber(val: string) {
    if (!val) return '';
    const num = val.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function parseNumber(val: string) {
    return val.replace(/\D/g, '');
}

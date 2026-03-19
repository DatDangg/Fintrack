export function calculateStats(transactions: any[]) {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === "income") totalIncome += Number(t.amount);
        else totalExpense += Number(t.amount);
    });

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
    };
}
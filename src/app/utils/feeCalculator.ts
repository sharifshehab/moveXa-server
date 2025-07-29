
export const feeCalculator = (weight: number, insideDhaka: boolean) => {
    const feePerWeight = 5;
    const baseFee = insideDhaka ? 50 : 100;
    return Number(weight) * feePerWeight + baseFee;
}
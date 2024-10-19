export function calculateATR(data, length) {
    const trs = [];
    const atrs = [];

    for (let i = 1; i < data.length; i++) {
        const high = data[i].high;
        const low = data[i].low;
        const prevClose = data[i - 1].close;
        const tr = Math.max(
            high - low,
            Math.abs(high - prevClose),
            Math.abs(low - prevClose)
        );
        trs.push(tr);
    }

    let sumTR = trs.slice(0, length).reduce((a, b) => a + b, 0);
    atrs[length] = sumTR / length;

    for (let i = length; i < trs.length; i++) {
        const atr = ((atrs[i - 1] * (length - 1)) + trs[i]) / length;
        atrs[i + 1] = atr;
    }

    // Prepend null values to match the length
    for (let i = 0; i <= length; i++) {
        atrs[i] = null;
    }

    return atrs;
}

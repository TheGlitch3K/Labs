export function ema(data, period) {
    const k = 2 / (period + 1);
    let emaData = [];
    let emaValue = data[0];

    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            emaData.push(emaValue);
        } else {
            emaValue = (data[i] - emaValue) * k + emaValue;
            emaData.push(emaValue);
        }
    }

    return emaData;
}

// Add other indicator utility functions here as needed
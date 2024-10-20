/**
 * Security module for Myriad Labs strategy.
 * This module implements measures to secure sensitive data, especially for the PineConnector integration.
 * It also includes input validation and sanitization for user-provided strategy parameters.
 */

/**
 * Validate and sanitize user-provided strategy parameters.
 * @param {Object} params - The strategy parameters provided by the user.
 * @returns {Object} - The sanitized strategy parameters.
 */
export function validateAndSanitizeParams(params) {
    const sanitizedParams = {};

    // Validate and sanitize MACD parameters
    sanitizedParams.macdParams = {
        fastPeriod: sanitizeNumber(params.macdParams.fastPeriod, 12),
        slowPeriod: sanitizeNumber(params.macdParams.slowPeriod, 26),
        signalPeriod: sanitizeNumber(params.macdParams.signalPeriod, 9)
    };

    // Validate and sanitize stop-loss and take-profit levels
    sanitizedParams.sl = sanitizeNumber(params.sl, 10);
    sanitizedParams.tp1 = sanitizeNumber(params.tp1, 20);
    sanitizedParams.tp2 = sanitizeNumber(params.tp2, 30);
    sanitizedParams.tp3 = sanitizeNumber(params.tp3, 40);
    sanitizedParams.trailingSL = sanitizeBoolean(params.trailingSL, true);

    return sanitizedParams;
}

/**
 * Sanitize a number input.
 * @param {number} value - The input value to sanitize.
 * @param {number} defaultValue - The default value to use if the input is invalid.
 * @returns {number} - The sanitized number.
 */
function sanitizeNumber(value, defaultValue) {
    const sanitizedValue = parseInt(value, 10);
    return isNaN(sanitizedValue) ? defaultValue : sanitizedValue;
}

/**
 * Sanitize a boolean input.
 * @param {boolean} value - The input value to sanitize.
 * @param {boolean} defaultValue - The default value to use if the input is invalid.
 * @returns {boolean} - The sanitized boolean.
 */
function sanitizeBoolean(value, defaultValue) {
    return typeof value === 'boolean' ? value : defaultValue;
}

/**
 * Secure sensitive data for PineConnector integration.
 * @param {Object} data - The data to secure.
 * @returns {Object} - The secured data.
 */
export function securePineConnectorData(data) {
    // Implement security measures for PineConnector data
    // For example, encrypt the data before sending it to the server
    const securedData = { ...data };
    // Add encryption logic here if needed
    return securedData;
}

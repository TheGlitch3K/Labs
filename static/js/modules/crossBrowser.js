/**
 * Cross-browser compatibility module
 * Ensures the strategy works consistently across different browsers and devices
 * Implements fallback options for browsers that don't support certain features
 */

/**
 * Check if the browser supports a specific feature
 * @param {string} feature - The feature to check
 * @returns {boolean} - True if the feature is supported, false otherwise
 */
export function isFeatureSupported(feature) {
    switch (feature) {
        case 'WebWorkers':
            return typeof Worker !== 'undefined';
        case 'LocalStorage':
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                return true;
            } catch (e) {
                return false;
            }
        case 'ServiceWorkers':
            return 'serviceWorker' in navigator;
        default:
            return false;
    }
}

/**
 * Apply fallback for unsupported features
 * @param {string} feature - The feature to apply fallback for
 */
export function applyFallback(feature) {
    switch (feature) {
        case 'WebWorkers':
            console.warn('Web Workers are not supported in this browser. Performance may be affected.');
            // Implement fallback logic if necessary
            break;
        case 'LocalStorage':
            console.warn('Local Storage is not supported in this browser. Data persistence may be affected.');
            // Implement fallback logic if necessary
            break;
        case 'ServiceWorkers':
            console.warn('Service Workers are not supported in this browser. Offline functionality may be affected.');
            // Implement fallback logic if necessary
            break;
        default:
            console.warn(`No fallback available for unsupported feature: ${feature}`);
            break;
    }
}

/**
 * Initialize cross-browser compatibility checks
 */
export function initCrossBrowserCompatibility() {
    const features = ['WebWorkers', 'LocalStorage', 'ServiceWorkers'];
    features.forEach(feature => {
        if (!isFeatureSupported(feature)) {
            applyFallback(feature);
        }
    });
}

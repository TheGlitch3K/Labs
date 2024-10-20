export function sendAlert(type, price) {
    const alertMessage = {
        type: type,
        price: price,
        timestamp: new Date().toISOString()
    };

    fetch('/api/send_alert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertMessage)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Alert sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending alert:', error);
    });
}

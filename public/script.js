// Create a WebSocket connection to the server
const socket = io();

const sendBtn = document.getElementById('send-btn');
const messageSelect = document.getElementById('message-select');
const webhookLog = document.getElementById('webhook-log');
const pushLog = document.getElementById('push-log');

const messageTranslations = {
  READY_FOR_SHIPPING: "Your parcel is ready for shipping.",
  PICKED_UP_BY_COURIER: "Your parcel has been picked up by the courier.",
  ARRIVED_AT_HUB: "Your parcel arrived at the distribution center.",
  DELIVERED: "Your parcel was delivered successfully!",
  DELIVERY_FAILED: "Delivery failed. Please check the tracking info."
};

function logMessage(container, text) {
  const li = document.createElement('li');
  li.textContent = text;
  li.classList.add('flash');
  container.prepend(li);
  setTimeout(() => li.classList.remove('flash'), 1000);
}

// Send a webhook when the button is clicked
sendBtn.addEventListener('click', async () => {
  const eventType = messageSelect.value;
  try {
    const res = await fetch(`/send-webhook/${encodeURIComponent(eventType)}`);
    if (!res.ok) throw new Error('Failed to send webhook');
    console.log('Webhook sent successfully');
  } catch (err) {
    console.log('Failed to send webhook', err);
  }
});

// Listen for messages from the server
socket.on('push-message', (message) => {
  const webhookTime = new Date().toLocaleString();
  logMessage(webhookLog, `[${webhookTime}] Webhook received: {"event":"${message}"}`);

  // Simulate a delay so it's noticeable in the Frontend
  setTimeout(() => {
    const phoneTime = new Date().toLocaleString();
    const translated = messageTranslations[message] || `Unknown event type: ${message}`;
    logMessage(pushLog, `[${phoneTime}] ${translated}`);
  }, 1000 + Math.random() * 2000);
});

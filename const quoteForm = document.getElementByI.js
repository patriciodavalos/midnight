const quoteForm = document.getElementById('quote-form');
const fileInput = document.getElementById('file');
const paymentForm = document.getElementById('payment-form');
const paymentSelect = document.getElementById('payment');
const cardNumberInput = document.getElementById('card-number');
const expirationDateInput = document.getElementById('expiration-date');
const cvvInput = document.getElementById('cvv');
const body = document.getElementById('body');

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // Get the file and process it to get the quote
});

paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // Get the payment method, card number, expiration date, and CVV
  // and process the payment
});

function changeBackground() {
  if (body.style.backgroundColor === 'orange') {
    body.style.backgroundColor = 'white';
    body.style.color = 'orange';
  } else {
    body.style.backgroundColor = 'orange';
    body.style.color = 'white';
  }
}

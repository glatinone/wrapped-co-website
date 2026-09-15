const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const year = document.querySelector('[data-year]');
const scentChoices = [...document.querySelectorAll('.scent-choice')];
const scentButtons = [...document.querySelectorAll('[data-choose-scent]')];
const orderSelect = document.querySelector('[data-order-scent]');
const orderCta = document.querySelector('[data-order-cta]');
const orderForm = document.querySelector('[data-order-form]');
const formStatus = document.querySelector('[data-form-status]');

if (year) year.textContent = new Date().getFullYear();

function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    navigation.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
}

function shortScentName(value) { return value.replace(/^No\. \d+ /, ''); }

function selectScent(value) {
  scentChoices.forEach((choice) => {
    const selected = choice.dataset.scent === value;
    choice.classList.toggle('is-selected', selected);
    choice.setAttribute('aria-pressed', String(selected));
  });
  if (orderSelect) orderSelect.value = value;
  if (orderCta) orderCta.firstChild.textContent = `Order ${shortScentName(value)} `;
}

scentChoices.forEach((choice) => choice.addEventListener('click', () => selectScent(choice.dataset.scent)));
scentButtons.forEach((button) => button.addEventListener('click', () => {
  selectScent(button.dataset.chooseScent);
  document.querySelector('#order')?.scrollIntoView({ behavior: 'smooth' });
}));
orderSelect?.addEventListener('change', () => selectScent(orderSelect.value));

orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const data = new FormData(orderForm);
  const subject = `Order request: ${data.get('scent')}`;
  const body = [
    'Hello WRAPPED.CO,', '', 'I would like to request an order:',
    `Scent: ${data.get('scent')}`, `Size: ${data.get('size')}`, `Quantity: ${data.get('quantity')}`,
    `Name: ${data.get('customerName')}`, `Email: ${data.get('email')}`,
    `Note: ${data.get('note') || 'None'}`, '', 'Please confirm availability and next steps. Thank you.'
  ].join('\n');
  if (formStatus) formStatus.textContent = 'Your email app is opening with the order details.';
  window.location.href = `mailto:hello@wrapped.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

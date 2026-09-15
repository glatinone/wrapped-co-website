const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const year = document.querySelector('[data-year]');
const scentChoices = [...document.querySelectorAll('.scent-choice')];
const scentButtons = [...document.querySelectorAll('[data-choose-scent]')];
const orderSelect = document.querySelector('[data-order-scent]');
const orderCta = document.querySelector('[data-order-cta]');
const orderForm = document.querySelector('[data-order-form]');
const formStatus = document.querySelector('[data-form-status]');
const previewTabs = [...document.querySelectorAll('.scent-tab')];
const previewImage = document.querySelector('[data-preview-image]');
const previewFamily = document.querySelector('[data-preview-family]');
const previewName = document.querySelector('[data-preview-name]');
const previewDescription = document.querySelector('[data-preview-description]');
const previewNotes = document.querySelector('[data-preview-notes]');
const previewMood = document.querySelector('[data-preview-mood]');
const previewOrder = document.querySelector('[data-preview-order]');

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

function updateProductPreview(tab) {
  if (!tab) return;
  previewTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });

  if (previewImage && previewImage.src !== new URL(tab.dataset.previewImageSrc, window.location.href).href) {
    previewImage.classList.add('is-changing');
    const nextImage = new Image();
    nextImage.onload = () => {
      previewImage.src = nextImage.src;
      previewImage.alt = tab.dataset.previewImageAlt;
      previewImage.classList.remove('is-changing');
    };
    nextImage.src = tab.dataset.previewImageSrc;
  }

  if (previewFamily) previewFamily.textContent = tab.dataset.previewFamilyLabel;
  if (previewName) previewName.textContent = tab.dataset.previewNameLabel;
  if (previewDescription) previewDescription.textContent = tab.dataset.previewDescription;
  if (previewNotes) previewNotes.textContent = tab.dataset.previewNotes;
  if (previewMood) previewMood.textContent = tab.dataset.previewMood;
  if (previewOrder) {
    previewOrder.dataset.chooseScent = tab.dataset.previewScent;
    previewOrder.firstChild.textContent = `Order ${tab.dataset.previewNameLabel} `;
  }
}

function selectScent(value) {
  scentChoices.forEach((choice) => {
    const selected = choice.dataset.scent === value;
    choice.classList.toggle('is-selected', selected);
    choice.setAttribute('aria-pressed', String(selected));
  });
  if (orderSelect) orderSelect.value = value;
  if (orderCta) orderCta.firstChild.textContent = `Order ${shortScentName(value)} `;
  updateProductPreview(previewTabs.find((tab) => tab.dataset.previewScent === value));
}

scentChoices.forEach((choice) => choice.addEventListener('click', () => selectScent(choice.dataset.scent)));
scentButtons.forEach((button) => button.addEventListener('click', () => {
  selectScent(button.dataset.chooseScent);
  document.querySelector('#order')?.scrollIntoView({ behavior: 'smooth' });
}));
orderSelect?.addEventListener('change', () => selectScent(orderSelect.value));
previewTabs.forEach((tab) => tab.addEventListener('click', () => selectScent(tab.dataset.previewScent)));

orderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const data = new FormData(orderForm);
  const businessNumber = orderForm.dataset.businessWhatsapp.replace(/\D/g, '');
  if (!businessNumber) {
    if (formStatus) formStatus.textContent = 'WhatsApp ordering is being connected. Please check back shortly.';
    return;
  }

  const message = [
    'Hello WRAPPED.CO,', '', 'I would like to place an order:',
    `Scent: ${data.get('scent')}`, `Size: ${data.get('size')}`, `Quantity: ${data.get('quantity')}`,
    `Name: ${data.get('customerName')}`, `My WhatsApp: ${data.get('customerWhatsApp')}`,
    `Note: ${data.get('note') || 'None'}`, '', 'Please confirm availability, total, and fulfillment details. Thank you.'
  ].join('\n');
  if (formStatus) formStatus.textContent = 'Opening WhatsApp with your order details.';
  window.location.href = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
});

document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const form = document.getElementById('add-card-form');
  const titleInput = document.getElementById('card-title');
  const descriptionInput = document.getElementById('card-description');
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const clearButton = document.getElementById('clear-cards'); // Новая кнопка

  const savedCards = JSON.parse(localStorage.getItem('cards')) || [];
  let cardCounter = 6;

  // Восстановление сохранённых карточек
  savedCards.forEach((card, index) => {
    addCardToSlide(card.title, card.description, index + 7);
  });

  // Добавление карточки при отправке формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    // Убираем предыдущие ошибки
    titleInput.style.border = '';
    descriptionInput.style.border = '';

    if (!title || !description) {
      // Если поле пустое, подсвечиваем его
      if (!title) titleInput.style.border = '2px solid red';
      if (!description) descriptionInput.style.border = '2px solid red';
      return; // Останавливаем дальнейшую обработку
    }

    cardCounter++;
    addCardToSlide(title, description, cardCounter);

    savedCards.push({ title, description });
    localStorage.setItem('cards', JSON.stringify(savedCards));

    form.reset();
    updateCounters(); // Сбрасываем счётчики
  });

  // Удаление добавленных карточек при нажатии кнопки
  clearButton.addEventListener('click', () => {
    // Удаление только добавленных карточек из локального хранилища
    localStorage.removeItem('cards');
    // Удаление только добавленных карточек из интерфейса
    const slides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));
    slides.forEach((slide) => {
      const cards = slide.querySelectorAll('.card');
      cards.forEach((card) => {
        const cardNumber = parseInt(card.querySelector('.number').textContent, 10);
        if (cardNumber > 6) {
          card.remove();
        }
      });
    });
    swiper.update(); // Обновление Swiper
    cardCounter = 6; // Сброс счётчика
  });

  // Функция для добавления карточки в слайд
  function addCardToSlide(title, description, number) {
    let lastSlide = swiperWrapper.lastElementChild;

    if (!lastSlide || lastSlide.querySelectorAll('.card').length >= 6) {
      const newSlide = document.createElement('div');
      newSlide.classList.add('swiper-slide');
      newSlide.innerHTML = `<div class="features-grid"></div>`;
      swiperWrapper.appendChild(newSlide);
      lastSlide = newSlide;
    }

    const cardHTML = `
      <div class="card">
        <div class="number">${number}</div>
        <h3 class="title">${truncateText(title, 50)}</h3>
        <p class="description">${truncateText(description, 120)}</p>
      </div>`;
    lastSlide.querySelector('.features-grid').innerHTML += cardHTML;

    swiper.update();
  }


  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  // Добавление счетчиков символов
  const maxTitleLength = 50;
  const maxDescriptionLength = 120;

  const titleCounter = document.createElement('div');
  const descriptionCounter = document.createElement('div');

  titleCounter.style.textAlign = 'right';
  titleCounter.style.marginBottom = '5px';
  titleCounter.textContent = `0 / ${maxTitleLength}`;
  titleInput.parentNode.insertBefore(titleCounter, titleInput.nextSibling);

  descriptionCounter.style.textAlign = 'right';
  descriptionCounter.style.marginBottom = '5px';
  descriptionCounter.textContent = `0 / ${maxDescriptionLength}`;
  descriptionInput.parentNode.insertBefore(descriptionCounter, descriptionInput.nextSibling);

  titleInput.addEventListener('input', () => {
    const length = titleInput.value.length;
    titleCounter.textContent = `${length} / ${maxTitleLength}`;
    titleCounter.style.color = length > maxTitleLength ? 'red' : 'inherit';
  });

  descriptionInput.addEventListener('input', () => {
    const length = descriptionInput.value.length;
    descriptionCounter.textContent = `${length} / ${maxDescriptionLength}`;
    descriptionCounter.style.color = length > maxDescriptionLength ? 'red' : 'inherit';
  });

  // Функция для сброса счетчиков символов
  function updateCounters() {
    titleCounter.textContent = `0 / ${maxTitleLength}`;
    descriptionCounter.textContent = `0 / ${maxDescriptionLength}`;
  }
});

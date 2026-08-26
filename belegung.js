(() => {
  const availability = {
    wohnung: {
      ready: false,
      occupied: [
        '2026-12-20',
        '2026-12-21',
        '2026-12-22',
        '2026-12-23',
        '2026-12-24',
        '2026-12-25',
        '2026-12-26',
        '2026-12-27',
        '2026-12-28',
        '2026-12-29'
      ]
    },
    studio: {
      ready: false,
      occupied: []
    }
  };

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let shownMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthLabel = document.getElementById('calendar-month');
  const prevButton = document.getElementById('calendar-prev');
  const nextButton = document.getElementById('calendar-next');

  if (!monthLabel || !prevButton || !nextButton) return;

  function isoDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function renderCalendar(containerId, unitKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const unit = availability[unitKey];
    container.innerHTML = '';

    weekDays.forEach((day) => {
      const cell = document.createElement('div');
      cell.className = 'calendar-weekday';
      cell.textContent = day;
      container.appendChild(cell);
    });

    const year = shownMonth.getFullYear();
    const month = shownMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startOffset; i += 1) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      container.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = isoDate(year, month, day);
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      cell.textContent = day;

      if (date < today) {
        cell.classList.add('past');
        cell.setAttribute('aria-label', `${day}. ${monthNames[month]} ${year}, vergangen`);
      } else if (unit.occupied.includes(key)) {
        cell.classList.add('occupied');
        cell.setAttribute('aria-label', `${day}. ${monthNames[month]} ${year}, belegt`);
      } else if (!unit.ready) {
        cell.classList.add('unknown');
        cell.setAttribute('aria-label', `${day}. ${monthNames[month]} ${year}, Belegung noch nicht eingetragen`);
      } else {
        cell.classList.add('available');
        cell.setAttribute('aria-label', `${day}. ${monthNames[month]} ${year}, frei`);
      }

      container.appendChild(cell);
    }

    const note = document.querySelector(`[data-calendar-note="${unitKey}"]`);
    if (note) {
      note.textContent = unit.ready
        ? 'Grün = frei · Rot = belegt.'
        : 'Rot = bereits belegt · weitere Belegungsdaten werden noch eingetragen.';
    }
  }

  function render() {
    monthLabel.textContent = `${monthNames[shownMonth.getMonth()]} ${shownMonth.getFullYear()}`;
    renderCalendar('calendar-wohnung', 'wohnung');
    renderCalendar('calendar-studio', 'studio');

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    prevButton.disabled = shownMonth <= currentMonth;
  }

  prevButton.addEventListener('click', () => {
    shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() - 1, 1);
    render();
  });

  nextButton.addEventListener('click', () => {
    shownMonth = new Date(shownMonth.getFullYear(), shownMonth.getMonth() + 1, 1);
    render();
  });

  render();
})();

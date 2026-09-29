// main.js

(function () {
  'use strict';

  // Получаем элементы
  var form = document.getElementById('checklist-form');
  var checkAllBtn = document.getElementById('check-all');
  var uncheckAllBtn = document.getElementById('uncheck-all');
  var showStatusBtn = document.getElementById('show-status');
  var statusEl = document.getElementById('checklist-status');
  var tabs = document.querySelectorAll('[role="tab"]');
  var panels = document.querySelectorAll('[role="tabpanel"]');
  var galleryImages = document.querySelectorAll('.photo-frame img');

  function activateTab(tab, moveFocus) {
    var panelId = tab.getAttribute('aria-controls');

    for (var tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      var isActive = tabs[tabIndex] === tab;
      tabs[tabIndex].setAttribute('aria-selected', isActive ? 'true' : 'false');
      tabs[tabIndex].setAttribute('tabindex', isActive ? '0' : '-1');
      tabs[tabIndex].classList.toggle('is-active', isActive);
    }

    for (var panelIndex = 0; panelIndex < panels.length; panelIndex++) {
      var isPanelActive = panels[panelIndex].id === panelId;
      panels[panelIndex].hidden = !isPanelActive;
      panels[panelIndex].classList.toggle('is-active', isPanelActive);
    }

    if (moveFocus) {
      tab.focus();
    }
  }

  for (var tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
    (function (tab, index) {
      tab.addEventListener('click', function () {
        activateTab(tab, false);
      });

      tab.addEventListener('keydown', function (event) {
        var nextIndex = index;

        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      });
    })(tabs[tabIndex], tabIndex);
  }

  for (var imageIndex = 0; imageIndex < galleryImages.length; imageIndex++) {
    (function (image) {
      function showImage() {
        image.parentElement.classList.add('is-loaded');
      }

      image.addEventListener('load', showImage);
      if (image.complete && image.naturalWidth > 0) {
        showImage();
      }
    })(galleryImages[imageIndex]);
  }

  if (!form || !checkAllBtn || !uncheckAllBtn || !showStatusBtn || !statusEl) {
    return;
  }

  // Получаем все чекбоксы
  var checkboxes = form.querySelectorAll('input[type="checkbox"][name="checklist"]');

  // Функция обновления статуса
  function updateStatus() {
    var total = checkboxes.length;
    var checked = 0;
    for (var i = 0; i < total; i++) {
      if (checkboxes[i].checked) {
        checked++;
      }
    }
    // Формируем текст через textContent
    statusEl.textContent = 'Отмечено ' + checked + ' из ' + total + ' пунктов.';
  }

  // Отметить все
  checkAllBtn.addEventListener('click', function () {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
    updateStatus();
  });

  // Снять все
  uncheckAllBtn.addEventListener('click', function () {
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
    updateStatus();
  });

  // Показать статус
  showStatusBtn.addEventListener('click', function () {
    updateStatus();
  });

  // Обновлять статус при изменении любого чекбокса
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', updateStatus);
  }

  // Начальный статус
  updateStatus();
})();
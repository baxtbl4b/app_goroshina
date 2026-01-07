// Диагностический скрипт для сброса курсора
console.log('=== Сброс курсора ===');
document.body.style.cursor = 'default';
document.documentElement.style.cursor = 'default';

// Проверяем все элементы с crosshair
const elements = document.querySelectorAll('*');
let foundCrosshair = false;
elements.forEach(el => {
  const computedStyle = window.getComputedStyle(el);
  if (computedStyle.cursor === 'crosshair' || el.style.cursor === 'crosshair') {
    console.log('Найден элемент с crosshair:', el);
    el.style.cursor = 'default';
    foundCrosshair = true;
  }
  if (computedStyle.pointerEvents === 'none' && el.parentElement === document.body) {
    console.log('Найден элемент с pointer-events: none:', el);
  }
});

if (!foundCrosshair) {
  console.log('Элементов с crosshair не найдено');
}

console.log('Body cursor:', document.body.style.cursor);
console.log('HTML cursor:', document.documentElement.style.cursor);
console.log('===================');

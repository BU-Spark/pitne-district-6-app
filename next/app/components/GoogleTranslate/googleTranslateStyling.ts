export function defaultStyle(
  remove: boolean,
  leftIcon: string,
  centerText: string,
  rightIcon: string,
  borderColor: string,
  backgroundColor: string,
  textColor = '#0072CE',
  textSize = '1rem',
  fontFamily = 'Montserrat'
): void {
  if (remove) {
    removeLeftIcon();
  }
  changeLeftIcon(leftIcon);
  changeCenterText(centerText);
  changeRightIcon(rightIcon);
  changeBorderColor(borderColor);
  changeBackgroundColor(backgroundColor);
  changeTextColor(textColor);
  changeTextSize(textSize);
  changeFontFamily(fontFamily); // NEW CALL
  uppercaseText(); // NEW CALL
  removeSelectBox();
  removeOverlay();
}

function removeLeftIcon(): void {
  const imgs = document.querySelectorAll<HTMLImageElement>('#google_translate_element img');
  if (imgs.length > 0) imgs[0].remove();
}

function changeLeftIcon(url: string): void {
  const imgs = document.querySelectorAll<HTMLImageElement>('#google_translate_element img');
  if (url !== '' && imgs.length > 0) {
    imgs[0].style.backgroundImage = '';
    imgs[0].src = url;
  }
}

function changeCenterText(text: string): void {
  const spans = document.querySelectorAll<HTMLSpanElement>('#google_translate_element span');
  if (text !== '' && spans.length > 1) {
    spans[1].textContent = text;
  }
}

function changeRightIcon(text: string): void {
  const spans = document.querySelectorAll<HTMLSpanElement>('#google_translate_element span');
  if (text !== '' && spans.length > 3) {
    spans[3].textContent = text;
  }
}

function changeBorderColor(color: string): void {
  if (color !== '') {
    const spans = document.querySelectorAll<HTMLSpanElement>('#google_translate_element span');
    const divs = document.querySelectorAll<HTMLDivElement>('#google_translate_element div');
    spans.forEach((span) => {
      span.style.borderColor = color;
    });
    if (divs.length > 1) divs[1].style.borderColor = color;
  }
}

function changeBackgroundColor(color: string): void {
  if (color !== '') {
    const divs = document.querySelectorAll<HTMLDivElement>('#google_translate_element div');
    if (divs.length > 1) divs[1].style.backgroundColor = color;
  }
}

function changeTextColor(color: string): void {
  if (color !== '') {
    const anchors = document.querySelectorAll<HTMLAnchorElement>('#google_translate_element a');
    anchors.forEach((a) => {
      a.style.color = color;
    });
  }
}

function changeTextSize(size: string): void {
  if (size !== '') {
    const anchors = document.querySelectorAll<HTMLAnchorElement>('#google_translate_element a');
    anchors.forEach((a) => {
      a.style.fontSize = size;
    });
  }
}

function changeFontFamily(font: string): void {
  if (font !== '') {
    const anchors = document.querySelectorAll<HTMLAnchorElement>('#google_translate_element a');
    anchors.forEach((a) => {
      a.style.fontFamily = font;
    });
  }
}

function uppercaseText(): void {
  const anchors = document.querySelectorAll<HTMLAnchorElement>('#google_translate_element a');
  anchors.forEach((a) => {
    a.style.textTransform = 'uppercase';
  });
}

function removeSelectBox(): void {
  const select = document.querySelector<HTMLSelectElement>('#google_translate_element select.goog-te-combo');
  if (select) {
    select.style.border = 'none';
    select.style.outline = 'none';
    select.style.boxShadow = 'none';
    select.style.background = 'transparent'; // optional, removes background box
  }
}

function removeOverlay(): void {
  const overlay = document.querySelector<HTMLDivElement>(
    '.goog-te-banner-frame.skiptranslate, .goog-overlay, .goog-te-menu-frame'
  );
  if (overlay) {
    overlay.style.display = 'none';
  }

  // Also target the global overlay div added by Google:
  const globalOverlay = document.querySelector<HTMLDivElement>('#goog-gt-tt, .goog-te-banner-frame');
  if (globalOverlay) {
    globalOverlay.style.display = 'none';
  }
}

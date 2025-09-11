export default function (element) {
  const CLASS_MOUSE_OVER = 'mouse-over';

  function updateMouseCoordinates(event) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    element.style.setProperty('--mouse-x', `${x}px`);
    element.style.setProperty('--mouse-y', `${y}px`);
  }

  function onMouseEnter(event) {
    updateMouseCoordinates(event);
  }

  function onMouseMove(event) {
    element.classList.add(CLASS_MOUSE_OVER);
    updateMouseCoordinates(event);
  }

  function onMouseLeave() {
    element.classList.remove(CLASS_MOUSE_OVER)
  }

  element.addEventListener('mouseenter', onMouseEnter);
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);
}

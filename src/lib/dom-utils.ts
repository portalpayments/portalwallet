export const checkIfScrolledAllTheWay = (element: svelte.JSX.Element) => {
  // Round because sometimes an element that's 70 pixels high can be scrolled 69.7 pixels down (and that's 'all the way')
  const howFarScrolled = Math.round(element.scrollTop + element.clientHeight);
  const scrollableArea = element.scrollHeight;
  const hasScrolledAllTheWay = howFarScrolled === scrollableArea;
  return hasScrolledAllTheWay;
};

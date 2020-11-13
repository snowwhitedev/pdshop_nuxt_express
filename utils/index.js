export const overflowText = (text, max) => {
  if (text && text.length > max) {
    return text.substring(0, max) + '...';
  }
  return text;
};

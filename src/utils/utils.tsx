const transFormCard = (cardString: string): string => {
  const cards = cardString
    .trim()
    .split(',')
    .map((value) => `'${value.trim()}'`);
  return `channels:[${cards}]`;
};

export { transFormCard };

export const formatWeight = (weight: number): string => {
  if (weight < 1) {
    const grams = weight * 1000;
    const formattedGrams =
      grams % 1 === 0 ? String(grams) : grams.toFixed(1).replace(/\.0$/, "");
    return `${formattedGrams} г`;
  } else {
    const formattedKg =
      weight % 1 === 0
        ? String(weight)
        : weight.toFixed(1).replace(/\.00$/, "");

    return `${formattedKg} кг`;
  }
};

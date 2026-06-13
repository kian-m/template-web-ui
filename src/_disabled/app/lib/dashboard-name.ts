export const colors = [
  'Red',
  'Green',
  'Blue',
  'Yellow',
  'Purple',
  'Orange',
  'Pink',
  'Gray',
  'White',
  'Black',
  'Maroon',
  'Teal',
  'Navy',
  'Lime',
  'Cyan',
  'Magenta',
  'Brown',
  'Beige',
  'Violet',
  'Gold',
  'Silver',
];

export const animals = [
  'Lion',
  'Tiger',
  'Bear',
  'Fox',
  'Wolf',
  'Eagle',
  'Shark',
  'Panda',
  'Elephant',
  'Rabbit',
  'Giraffe',
  'Hippo',
  'Zebra',
  'Koala',
  'Kangaroo',
  'Monkey',
  'Dolphin',
  'Whale',
  'Otter',
  'Lemur',
];

/**
 * Generates a unique dashboard name like "red-tiger".
 * If the generated name already exists, it will retry with new
 * combinations until a unique one is found or all combinations are exhausted.
 */
const maxTries = colors.length * animals.length;

export function generateUniqueDashboardName(existingNames: string[]): string {
  const lowerExisting = existingNames.map((n) => n.toLowerCase());
  for (let i = 0; i < maxTries; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const candidate = `${color}-${animal}`;
    if (!lowerExisting.includes(candidate.toLowerCase())) {
      return candidate;
    }
  }

  // Fallback: append an incrementing number to ensure uniqueness
  let index = 1;
  let base = `${colors[0]}-${animals[0]}`;
  while (lowerExisting.includes(`${base}-${index}`.toLowerCase())) {
    index++;
  }
  return `${base}-${index}`;
}

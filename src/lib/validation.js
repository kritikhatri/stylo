export const CATEGORIES = ["TOP", "BOTTOM", "DRESS", "LAYER", "SHOES", "ACCESSORY"];

export const EDITABLE_FIELDS = [
  "name", "category", "colours", "fabric",
  "warmth", "formality", "imageUrl", "inLaundry",
];

// Is n a whole number from 1 to 5?
export const validScale = (n) => Number.isInteger(n) && n >= 1 && n <= 5;

// Turns "5" into 5. Returns null if it isn't a positive whole number.
export const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};
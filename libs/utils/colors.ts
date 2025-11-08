export const COLORS = [
  "#FF6B6B", // Red
  "#FF9F43", // Orange
  "#FFC312", // Yellow
  "#1DD1A1", // Green
  "#10AC84", // Teal
  "#2E86DE", // Blue
  "#341F97", // Indigo
  "#5F27CD", // Purple
  "#EE5253", // Coral
  "#54A0FF", // Light Blue
];

export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

export function getColorFromString(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
];

export default function ColorRandomizer() {
  return colors[Math.floor(Math.random() * colors.length)];
}

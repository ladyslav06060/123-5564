export type Product = {
  id: string;
  name: string;
  category: "Цитрусові" | "Ягідні" | "Фруктові мікси";
  price: number; // UAH
  volume: string;
  image: string; // /images/filename.jpg, place assets in public/images
  description?: string;
};

// Add your products here. The storefront intentionally starts empty.
export const products: Product[] = [];
export const money = (value: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(value);

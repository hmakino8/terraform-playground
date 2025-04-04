import { useScreen } from "@/user/hooks/useScreen";
import { Separator } from "../ui/Separator";
import { useProduct } from "@/user/hooks/useProduct";
import { useReservation } from "@/user/hooks/useReservation";
import type { Product } from "@/user/api/productApi";

export const MenuScreen = () => {
  const { products } = useProduct();
  const categories: {
    [key: string]: { products: Product[]; label: string };
  } = {
    smoothie: { products: [], label: "スムージー" },
    softDrink: { products: [], label: "ソフトドリンク" },
    coffee: { products: [], label: "コーヒー" },
    tea: { products: [], label: "ティー" },
    espresso: { products: [], label: "エスプレッソ" },
  };

  products.forEach((product) => {
    if (product.category in categories) {
      categories[product.category as keyof typeof categories].products.push(
        product
      );
    }
  });

  const ProductMenuByCategory = ({
    products,
    category,
  }: {
    products: Product[];
    category: string;
  }) => {
    const ProductMenuButton = ({ product }: { product: Product }) => {
      const { setActiveScreenCheckAuth } = useScreen();
      const { setSelectedProduct } = useReservation();

      const haneleClick = () => {
        setActiveScreenCheckAuth("SelectedProductScreen");
        setSelectedProduct({
          ...product,
        });
      };

      return (
        <button
          className="flex flex-col w-28 sm:w-36 h-auto text-sm"
          onClick={haneleClick}
        >
          <img
            src={`/images/${product.image}`}
            alt={product.name}
            className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-md"
          />
          <div className="text-start text-[12px] sm:text-sm">
            <p className="pt-2">{product.name}</p>
            <p>{`¥${Math.floor(product.price_m)}`}</p>
          </div>
        </button>
      );
    };

    return (
      <div className="flex flex-col">
        <p className="pb-2 text-black">{category}</p>
        <div className="flex flex-wrap gap-3">
          {products.map((product: Product) => (
            <ProductMenuButton key={product.id} product={product} />
          ))}
        </div>
        <Separator />
      </div>
    );
  };

  return (
    <>
      {Object.values(categories).map(({ products, label }) => (
        <ProductMenuByCategory
          key={label}
          products={products}
          category={label}
        />
      ))}
    </>
  );
};

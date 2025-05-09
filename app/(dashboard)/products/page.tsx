import ProductsUI from "./ui";
import prisma from "@/lib/prisma";

export default async function ProductsPage() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      category: {
        select: { id: true, name: true, img: true },
      },
      images: true,
      model: true,
      price: true,
      discount_percentage: true,
      quantity: true,
      rating: true,
      sold: true,
      status: true,
    },
  });

  return <ProductsUI products={products} categories={categories} />;
}

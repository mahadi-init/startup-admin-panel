"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { Category } from "@/db/prisma";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UiDialog } from "@/components/ui-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Upload, Filter } from "lucide-react";

type ProductDataType = {
  category: {
    id: string;
    name: string;
    img: string | null;
  };
  model: string | null;
  id: string;
  name: string;
  price: number | null;
  discount_percentage: number | null;
  rating: number | null;
  sold: number;
  quantity: number;
  status: string;
  images: string[];
};

export default function ProductsUI({
  categories,
  products,
}: {
  categories: Category[];
  products: ProductDataType[];
}) {
  // const {
  //   filteredProducts,
  //   productSearch,
  //   setProductSearch,
  //   productFilter,
  //   setProductFilter,
  //   addProduct,
  //   updateProduct,
  // } = useData();
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleProductSearch = (search: string) => {
    const filteredProducts = products.filter((product) => {
      return (
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.name.toLowerCase().includes(search.toLowerCase()) ||
        product.status.toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredProducts(filteredProducts);
  };

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductDataType | null>(
    null,
  );

  // Form state for add/edit product
  // const [formData, setFormData] = useState({
  //   name: "",
  //   category: "",
  //   price: "",
  //   stock: "",
  //   description: "",
  //   image: "",
  // });

  // Reset form data
  // const resetFormData = () => {
  //   setFormData({
  //     name: "",
  //     category: "",
  //     price: "",
  //     stock: "",
  //     description: "",
  //     image: "",
  //   });
  // };

  // Handle opening edit dialog
  // const handleEditProduct = (product: Product) => {
  //   setCurrentProduct(product);
  //   setFormData({
  //     name: product.name,
  //     category: product.category.toLowerCase(),
  //     price: product.price.toString(),
  //     stock: product.stock.toString(),
  //     description: product.description || "",
  //     image: product.image || "",
  //   });
  //   setIsEditProductOpen(true);
  // };

  // Handle form input changes
  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => {
  //   const { id, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [id]: value,
  //   });
  // };

  // Handle select changes
  // const handleSelectChange = (id: string, value: string) => {
  //   setFormData({
  //     ...formData,
  //     [id]: value,
  //   });
  // };

  // Handle add product submission
  // const handleAddProduct = () => {
  //   addProduct({
  //     name: formData.name,
  //     category:
  //       formData.category.charAt(0).toUpperCase() + formData.category.slice(1),
  //     price: Number.parseFloat(formData.price) || 0,
  //     stock: Number.parseInt(formData.stock) || 0,
  //     status: Number.parseInt(formData.stock) > 0 ? "In Stock" : "Out of Stock",
  //     description: formData.description,
  //     image: formData.image,
  //   });
  //   setIsAddProductOpen(false);
  //   resetFormData();
  // };

  // Handle edit product submission
  // const handleUpdateProduct = () => {
  //   if (currentProduct) {
  //     updateProduct({
  //       id: currentProduct.id,
  //       name: formData.name,
  //       category:
  //         formData.category.charAt(0).toUpperCase() +
  //         formData.category.slice(1),
  //       price: Number.parseFloat(formData.price) || 0,
  //       stock: Number.parseInt(formData.stock) || 0,
  //       status:
  //         Number.parseInt(formData.stock) > 0 ? "In Stock" : "Out of Stock",
  //       description: formData.description,
  //       image: formData.image,
  //     });
  //     setIsEditProductOpen(false);
  //     setCurrentProduct(null);
  //     resetFormData();
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button
          onClick={() => {
            // resetFormData();
            setIsAddProductOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog and inventory levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8"
                onChange={(e) => handleProductSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
                {/*productFilter && (
                  <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>
                )*/}
              </Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-zinc-100 dark:bg-zinc-800">
                            <Image
                              src={`/placeholder.svg?height=40&width=40&text=${product.id}`}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.category.name}
                      </TableCell>
                      <TableCell>${product.price?.toPrecision()}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.quantity - product?.sold}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "In Stock"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          // onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <UiDialog
        title="Add New Product"
        description="Add a new product to your inventory."
        // isOpen={isAddProductOpen}
        isOpen={false}
        // onClose={() => setIsAddProductOpen(false)}
        onClose={() => {}}
        footer={
          <>
            <Button
              variant="outline"
              // onClick={() => setIsAddProductOpen(false)}
            >
              Cancel
            </Button>
            <Button
            // onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Product name"
              className="col-span-3"
              // value={formData.name}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
            // value={formData.category}
            // onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              className="col-span-3"
              // value={formData.price}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              className="col-span-3"
              // value={formData.stock}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Product description"
              className="col-span-3"
              // value={formData.description}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Image</Label>
            <div className="col-span-3">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-zinc-500" />
                    <p className="mb-2 text-sm text-zinc-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-zinc-500">
                      PNG, JPG or WEBP (MAX. 2MB)
                    </p>
                  </div>
                  <Input id="image" type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </UiDialog>

      {/* Edit Product Dialog */}
      <UiDialog
        title="Edit Product"
        description="Update product details and inventory."
        // isOpen={isEditProductOpen}
        // onClose={() => setIsEditProductOpen(false)}
        isOpen={false}
        onClose={() => {}}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditProductOpen(false)}
            >
              Cancel
            </Button>
            <Button
            // onClick={handleUpdateProduct}
            >
              Update Product
            </Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Product name"
              className="col-span-3"
              // value={formData.name}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
            // value={formData.category}
            // onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              className="col-span-3"
              // value={formData.price}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              placeholder="0"
              className="col-span-3"
              // value={formData.stock}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Product description"
              className="col-span-3"
              // value={formData.description}
              // onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Image</Label>
            <div className="col-span-3">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-zinc-500" />
                    <p className="mb-2 text-sm text-zinc-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-zinc-500">
                      PNG, JPG or WEBP (MAX. 2MB)
                    </p>
                  </div>
                  <Input id="image" type="file" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </UiDialog>

      {/* Filter Dialog */}
      <UiDialog
        title="Filter Products"
        description="Filter products by category and stock status."
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                // setProductFilter("");
                setIsFilterOpen(false);
              }}
            >
              Clear Filters
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-filter" className="text-right">
              Category
            </Label>
            <Select
            // value={productFilter}
            // onValueChange={(value) => setProductFilter(value)}
            >
              <SelectTrigger id="category-filter" className="col-span-3">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock-filter" className="text-right">
              Stock Status
            </Label>
            <Select
            // value={productFilter}
            // onValueChange={(value) => setProductFilter(value)}
            >
              <SelectTrigger id="stock-filter" className="col-span-3">
                <SelectValue placeholder="All Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </UiDialog>
    </div>
  );
}

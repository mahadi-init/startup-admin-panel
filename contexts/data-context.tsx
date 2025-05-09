"use client";

import type React from "react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Define types for our data
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  description?: string;
  image?: string;
};

export type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items?: OrderItem[];
  address?: string;
  paymentMethod?: string;
  notes?: string;
};

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
};

export type InventoryItem = {
  id: number;
  name: string;
  sku: string;
  stock: number;
  reorderLevel: number;
  stockStatus: number;
};

// Define validation error types
export type ValidationErrors = {
  [key: string]: string;
};

// Define the context type
type DataContextType = {
  // Users
  users: User[];
  setUsers: React.Dispatch<SetStateAction<User[]>>;
  filteredUsers: User[];
  userSearch: string;
  setUserSearch: Dispatch<SetStateAction<string>>;
  userFilter: string;
  setUserFilter: Dispatch<SetStateAction<string>>;
  addUser: (user: Omit<User, "id">) => {
    success: boolean;
    errors?: ValidationErrors;
  };
  updateUser: (user: User) => { success: boolean; errors?: ValidationErrors };
  deleteUser: (id: number) => void;

  // Products
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  filteredProducts: Product[];
  productSearch: string;
  setProductSearch: Dispatch<SetStateAction<string>>;
  productFilter: string;
  setProductFilter: Dispatch<SetStateAction<string>>;
  addProduct: (product: Omit<Product, "id">) => {
    success: boolean;
    errors?: ValidationErrors;
  };
  updateProduct: (product: Product) => {
    success: boolean;
    errors?: ValidationErrors;
  };
  deleteProduct: (id: number) => void;

  // Orders
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  filteredOrders: Order[];
  orderSearch: string;
  setOrderSearch: Dispatch<SetStateAction<string>>;
  orderFilter: string;
  setOrderFilter: Dispatch<SetStateAction<string>>;
  orderSort: string;
  setOrderSort: Dispatch<SetStateAction<string>>;
  updateOrderStatus: (id: string, status: string) => void;

  // Inventory
  inventory: InventoryItem[];
  setInventory: Dispatch<SetStateAction<InventoryItem[]>>;
  filteredInventory: InventoryItem[];
  inventorySearch: string;
  setInventorySearch: Dispatch<SetStateAction<string>>;
  inventoryFilter: string;
  setInventoryFilter: Dispatch<SetStateAction<string>>;
  updateInventoryItem: (item: InventoryItem) => {
    success: boolean;
    errors?: ValidationErrors;
  };

  // Loading states
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
];

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 299.99,
    stock: 45,
    status: "In Stock",
    description: "Comfortable ergonomic office chair with lumbar support",
  },
];

const sampleOrders: Order[] = [
  {
    id: "#ORD-004",
    customer: "Emily Davis",
    date: "2024-03-22",
    total: 399.99,
    status: "Pending",
    items: [
      {
        id: 1,
        productId: 4,
        productName: "Standing Desk",
        quantity: 1,
        price: 399.99,
      },
    ],
    address: "101 Elm St, Elsewhere, USA",
    paymentMethod: "Bank Transfer",
  },
];

const sampleInventory: InventoryItem[] = [
  {
    id: 4,
    name: "Standing Desk",
    sku: "DESK-004",
    stock: 12,
    reorderLevel: 5,
    stockStatus: 70,
  },
  {
    id: 5,
    name: "Laptop Backpack",
    sku: "BAG-005",
    stock: 34,
    reorderLevel: 20,
    stockStatus: 60,
  },
];

// Validation functions
const validateUser = (
  user: Omit<User, "id"> | User,
): ValidationErrors | null => {
  const errors: ValidationErrors = {};

  if (!user.name.trim()) {
    errors.name = "Name is required";
  }

  if (!user.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(user.email)) {
    errors.email = "Email is invalid";
  }

  if (!user.role) {
    errors.role = "Role is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const validateProduct = (
  product: Omit<Product, "id"> | Product,
): ValidationErrors | null => {
  const errors: ValidationErrors = {};

  if (!product.name.trim()) {
    errors.name = "Name is required";
  }

  if (!product.category) {
    errors.category = "Category is required";
  }

  if (product.price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (product.stock < 0) {
    errors.stock = "Stock cannot be negative";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const validateInventoryItem = (
  item: InventoryItem,
): ValidationErrors | null => {
  const errors: ValidationErrors = {};

  if (item.stock < 0) {
    errors.stock = "Stock cannot be negative";
  }

  if (item.reorderLevel <= 0) {
    errors.reorderLevel = "Reorder level must be greater than 0";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

// Create the provider
export function DataProvider({ children }: { children: ReactNode }) {
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Users state
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");

  // Products state
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [productSearch, setProductSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");

  // Orders state
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [orderSort, setOrderSort] = useState("");

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("");

  // Filter users based on search and filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      userSearch === "" ||
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());

    const matchesFilter =
      userFilter === "" ||
      userFilter === "all" ||
      (userFilter === "active" && user.status === "Active") ||
      (userFilter === "inactive" && user.status === "Inactive") ||
      userFilter === user.role.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Filter products based on search and filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      productSearch === "" ||
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearch.toLowerCase());

    const matchesFilter =
      productFilter === "" ||
      productFilter === "all" ||
      (productFilter === "in-stock" && product.status === "In Stock") ||
      (productFilter === "out-of-stock" && product.status === "Out of Stock") ||
      productFilter === product.category.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Filter orders based on search, filter, and sort
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        orderSearch === "" ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customer.toLowerCase().includes(orderSearch.toLowerCase());

      const matchesFilter =
        orderFilter === "" || orderFilter === order.status.toLowerCase();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (orderSort === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (orderSort === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (orderSort === "total-asc") {
        return a.total - b.total;
      } else if (orderSort === "total-desc") {
        return b.total - a.total;
      }
      return 0;
    });

  // Filter inventory based on search and filter
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      inventorySearch === "" ||
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(inventorySearch.toLowerCase());

    const matchesFilter =
      inventoryFilter === "" ||
      inventoryFilter === "all" ||
      (inventoryFilter === "low-stock" && item.stock <= item.reorderLevel) ||
      (inventoryFilter === "in-stock" && item.stock > item.reorderLevel);

    return matchesSearch && matchesFilter;
  });

  // Add a new user
  const addUser = (user: Omit<User, "id">) => {
    const errors = validateUser(user);
    if (errors) {
      return { success: false, errors };
    }

    const newUser = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    };
    setUsers([...users, newUser]);
    return { success: true };
  };

  // Update an existing user
  const updateUser = (user: User) => {
    const errors = validateUser(user);
    if (errors) {
      return { success: false, errors };
    }

    setUsers(users.map((u) => (u.id === user.id ? user : u)));
    return { success: true };
  };

  // Delete a user
  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Add a new product
  const addProduct = (product: Omit<Product, "id">) => {
    const errors = validateProduct(product);
    if (errors) {
      return { success: false, errors };
    }

    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    };
    setProducts([...products, newProduct]);
    return { success: true };
  };

  // Update an existing product
  const updateProduct = (product: Product) => {
    const errors = validateProduct(product);
    if (errors) {
      return { success: false, errors };
    }

    setProducts(products.map((p) => (p.id === product.id ? product : p)));
    return { success: true };
  };

  // Delete a product
  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Update order status
  const updateOrderStatus = (id: string, status: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // Update an inventory item
  const updateInventoryItem = (item: InventoryItem) => {
    const errors = validateInventoryItem(item);
    if (errors) {
      return { success: false, errors };
    }

    setInventory(inventory.map((i) => (i.id === item.id ? item : i)));
    return { success: true };
  };

  return (
    <DataContext.Provider
      value={{
        users,
        setUsers,
        filteredUsers,
        userSearch,
        setUserSearch,
        userFilter,
        setUserFilter,
        addUser,
        updateUser,
        deleteUser,

        products,
        setProducts,
        filteredProducts,
        productSearch,
        setProductSearch,
        productFilter,
        setProductFilter,
        addProduct,
        updateProduct,
        deleteProduct,

        orders,
        setOrders,
        filteredOrders,
        orderSearch,
        setOrderSearch,
        orderFilter,
        setOrderFilter,
        orderSort,
        setOrderSort,
        updateOrderStatus,

        inventory,
        setInventory,
        filteredInventory,
        inventorySearch,
        setInventorySearch,
        inventoryFilter,
        setInventoryFilter,
        updateInventoryItem,

        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useData() {
  const context = use(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

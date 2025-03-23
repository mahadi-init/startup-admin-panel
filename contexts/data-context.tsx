"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

// Define types for our data
export type User = {
  id: number
  name: string
  email: string
  role: string
  status: string
}

export type Product = {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: string
  description?: string
  image?: string
}

export type Order = {
  id: string
  customer: string
  date: string
  total: number
  status: string
  items?: OrderItem[]
  address?: string
  paymentMethod?: string
  notes?: string
}

export type OrderItem = {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
}

export type InventoryItem = {
  id: number
  name: string
  sku: string
  stock: number
  reorderLevel: number
  stockStatus: number
}

// Define validation error types
export type ValidationErrors = {
  [key: string]: string
}

// Define the context type
type DataContextType = {
  // Users
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  filteredUsers: User[]
  userSearch: string
  setUserSearch: React.Dispatch<React.SetStateAction<string>>
  userFilter: string
  setUserFilter: React.Dispatch<React.SetStateAction<string>>
  addUser: (user: Omit<User, "id">) => { success: boolean; errors?: ValidationErrors }
  updateUser: (user: User) => { success: boolean; errors?: ValidationErrors }
  deleteUser: (id: number) => void

  // Products
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  filteredProducts: Product[]
  productSearch: string
  setProductSearch: React.Dispatch<React.SetStateAction<string>>
  productFilter: string
  setProductFilter: React.Dispatch<React.SetStateAction<string>>
  addProduct: (product: Omit<Product, "id">) => { success: boolean; errors?: ValidationErrors }
  updateProduct: (product: Product) => { success: boolean; errors?: ValidationErrors }
  deleteProduct: (id: number) => void

  // Orders
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>
  filteredOrders: Order[]
  orderSearch: string
  setOrderSearch: React.Dispatch<React.SetStateAction<string>>
  orderFilter: string
  setOrderFilter: React.Dispatch<React.SetStateAction<string>>
  orderSort: string
  setOrderSort: React.Dispatch<React.SetStateAction<string>>
  updateOrderStatus: (id: string, status: string) => void

  // Inventory
  inventory: InventoryItem[]
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
  filteredInventory: InventoryItem[]
  inventorySearch: string
  setInventorySearch: React.Dispatch<React.SetStateAction<string>>
  inventoryFilter: string
  setInventoryFilter: React.Dispatch<React.SetStateAction<string>>
  updateInventoryItem: (item: InventoryItem) => { success: boolean; errors?: ValidationErrors }

  // Loading states
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined)

// Sample data
const sampleUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Viewer", status: "Inactive" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Editor", status: "Active" },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "Viewer", status: "Active" },
]

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
  {
    id: 2,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 28,
    status: "In Stock",
    description: "Noise-cancelling wireless headphones with 30-hour battery life",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 89.99,
    stock: 0,
    status: "Out of Stock",
    description: "Mechanical gaming keyboard with RGB lighting",
  },
  {
    id: 4,
    name: "Standing Desk",
    category: "Furniture",
    price: 399.99,
    stock: 12,
    status: "In Stock",
    description: "Adjustable height standing desk with electric motor",
  },
  {
    id: 5,
    name: "Laptop Backpack",
    category: "Accessories",
    price: 59.99,
    stock: 34,
    status: "In Stock",
    description: "Water-resistant laptop backpack with multiple compartments",
  },
]

const sampleOrders: Order[] = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    date: "2024-03-15",
    total: 299.99,
    status: "Delivered",
    items: [{ id: 1, productId: 1, productName: "Ergonomic Chair", quantity: 1, price: 299.99 }],
    address: "123 Main St, Anytown, USA",
    paymentMethod: "Credit Card",
    notes: "Leave at front door",
  },
  {
    id: "#ORD-002",
    customer: "Jane Smith",
    date: "2024-03-18",
    total: 149.99,
    status: "Processing",
    items: [{ id: 1, productId: 2, productName: "Wireless Headphones", quantity: 1, price: 149.99 }],
    address: "456 Oak Ave, Somewhere, USA",
    paymentMethod: "PayPal",
  },
  {
    id: "#ORD-003",
    customer: "Robert Johnson",
    date: "2024-03-20",
    total: 89.99,
    status: "Shipped",
    items: [{ id: 1, productId: 3, productName: "Mechanical Keyboard", quantity: 1, price: 89.99 }],
    address: "789 Pine Rd, Nowhere, USA",
    paymentMethod: "Credit Card",
  },
  {
    id: "#ORD-004",
    customer: "Emily Davis",
    date: "2024-03-22",
    total: 399.99,
    status: "Pending",
    items: [{ id: 1, productId: 4, productName: "Standing Desk", quantity: 1, price: 399.99 }],
    address: "101 Elm St, Elsewhere, USA",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "#ORD-005",
    customer: "Michael Wilson",
    date: "2024-03-24",
    total: 59.99,
    status: "Delivered",
    items: [{ id: 1, productId: 5, productName: "Laptop Backpack", quantity: 1, price: 59.99 }],
    address: "202 Cedar Ln, Anywhere, USA",
    paymentMethod: "Credit Card",
  },
]

const sampleInventory: InventoryItem[] = [
  { id: 1, name: "Ergonomic Chair", sku: "CHAIR-001", stock: 45, reorderLevel: 10, stockStatus: 82 },
  { id: 2, name: "Wireless Headphones", sku: "AUDIO-002", stock: 28, reorderLevel: 15, stockStatus: 65 },
  { id: 3, name: "Mechanical Keyboard", sku: "KB-003", stock: 3, reorderLevel: 10, stockStatus: 15 },
  { id: 4, name: "Standing Desk", sku: "DESK-004", stock: 12, reorderLevel: 5, stockStatus: 70 },
  { id: 5, name: "Laptop Backpack", sku: "BAG-005", stock: 34, reorderLevel: 20, stockStatus: 60 },
]

// Validation functions
const validateUser = (user: Omit<User, "id"> | User): ValidationErrors | null => {
  const errors: ValidationErrors = {}

  if (!user.name.trim()) {
    errors.name = "Name is required"
  }

  if (!user.email.trim()) {
    errors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(user.email)) {
    errors.email = "Email is invalid"
  }

  if (!user.role) {
    errors.role = "Role is required"
  }

  return Object.keys(errors).length > 0 ? errors : null
}

const validateProduct = (product: Omit<Product, "id"> | Product): ValidationErrors | null => {
  const errors: ValidationErrors = {}

  if (!product.name.trim()) {
    errors.name = "Name is required"
  }

  if (!product.category) {
    errors.category = "Category is required"
  }

  if (product.price <= 0) {
    errors.price = "Price must be greater than 0"
  }

  if (product.stock < 0) {
    errors.stock = "Stock cannot be negative"
  }

  return Object.keys(errors).length > 0 ? errors : null
}

const validateInventoryItem = (item: InventoryItem): ValidationErrors | null => {
  const errors: ValidationErrors = {}

  if (item.stock < 0) {
    errors.stock = "Stock cannot be negative"
  }

  if (item.reorderLevel <= 0) {
    errors.reorderLevel = "Reorder level must be greater than 0"
  }

  return Object.keys(errors).length > 0 ? errors : null
}

// Create the provider
export function DataProvider({ children }: { children: ReactNode }) {
  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Users state
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [userSearch, setUserSearch] = useState("")
  const [userFilter, setUserFilter] = useState("")

  // Products state
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [productSearch, setProductSearch] = useState("")
  const [productFilter, setProductFilter] = useState("")

  // Orders state
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [orderSearch, setOrderSearch] = useState("")
  const [orderFilter, setOrderFilter] = useState("")
  const [orderSort, setOrderSort] = useState("")

  // Inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory)
  const [inventorySearch, setInventorySearch] = useState("")
  const [inventoryFilter, setInventoryFilter] = useState("")

  // Filter users based on search and filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      userSearch === "" ||
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())

    const matchesFilter =
      userFilter === "" ||
      userFilter === "all" ||
      (userFilter === "active" && user.status === "Active") ||
      (userFilter === "inactive" && user.status === "Inactive") ||
      userFilter === user.role.toLowerCase()

    return matchesSearch && matchesFilter
  })

  // Filter products based on search and filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      productSearch === "" ||
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearch.toLowerCase())

    const matchesFilter =
      productFilter === "" ||
      productFilter === "all" ||
      (productFilter === "in-stock" && product.status === "In Stock") ||
      (productFilter === "out-of-stock" && product.status === "Out of Stock") ||
      productFilter === product.category.toLowerCase()

    return matchesSearch && matchesFilter
  })

  // Filter orders based on search, filter, and sort
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        orderSearch === "" ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customer.toLowerCase().includes(orderSearch.toLowerCase())

      const matchesFilter = orderFilter === "" || orderFilter === order.status.toLowerCase()

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (orderSort === "date-asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (orderSort === "date-desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (orderSort === "total-asc") {
        return a.total - b.total
      } else if (orderSort === "total-desc") {
        return b.total - a.total
      }
      return 0
    })

  // Filter inventory based on search and filter
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      inventorySearch === "" ||
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(inventorySearch.toLowerCase())

    const matchesFilter =
      inventoryFilter === "" ||
      inventoryFilter === "all" ||
      (inventoryFilter === "low-stock" && item.stock <= item.reorderLevel) ||
      (inventoryFilter === "in-stock" && item.stock > item.reorderLevel)

    return matchesSearch && matchesFilter
  })

  // Add a new user
  const addUser = (user: Omit<User, "id">) => {
    const errors = validateUser(user)
    if (errors) {
      return { success: false, errors }
    }

    const newUser = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    }
    setUsers([...users, newUser])
    return { success: true }
  }

  // Update an existing user
  const updateUser = (user: User) => {
    const errors = validateUser(user)
    if (errors) {
      return { success: false, errors }
    }

    setUsers(users.map((u) => (u.id === user.id ? user : u)))
    return { success: true }
  }

  // Delete a user
  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  // Add a new product
  const addProduct = (product: Omit<Product, "id">) => {
    const errors = validateProduct(product)
    if (errors) {
      return { success: false, errors }
    }

    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    }
    setProducts([...products, newProduct])
    return { success: true }
  }

  // Update an existing product
  const updateProduct = (product: Product) => {
    const errors = validateProduct(product)
    if (errors) {
      return { success: false, errors }
    }

    setProducts(products.map((p) => (p.id === product.id ? product : p)))
    return { success: true }
  }

  // Delete a product
  const deleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  // Update order status
  const updateOrderStatus = (id: string, status: string) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  // Update an inventory item
  const updateInventoryItem = (item: InventoryItem) => {
    const errors = validateInventoryItem(item)
    if (errors) {
      return { success: false, errors }
    }

    setInventory(inventory.map((i) => (i.id === item.id ? item : i)))
    return { success: true }
  }

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
  )
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}


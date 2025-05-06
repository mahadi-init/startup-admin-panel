"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Filter, Search } from "lucide-react"
import { UiDialog } from "@/components/ui-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useData, type InventoryItem } from "@/contexts/data-context"

export default function InventoryPage() {
  const {
    filteredInventory,
    inventorySearch,
    setInventorySearch,
    inventoryFilter,
    setInventoryFilter,
    updateInventoryItem,
  } = useData()

  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [isUpdateInventoryOpen, setIsUpdateInventoryOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)

  // Form state for update inventory
  const [formData, setFormData] = useState({
    stock: "",
    reorderLevel: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Reset form data
  const resetFormData = () => {
    setFormData({
      stock: "",
      reorderLevel: "",
      reason: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  // Handle opening update dialog
  const handleUpdateItem = (item: InventoryItem) => {
    setCurrentItem(item)
    setFormData({
      stock: item.stock.toString(),
      reorderLevel: item.reorderLevel.toString(),
      reason: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsUpdateInventoryOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    }
  }

  // Handle update inventory submission
  const handleUpdateInventory = () => {
    if (currentItem) {
      const stock = Number.parseInt(formData.stock) || 0
      const reorderLevel = Number.parseInt(formData.reorderLevel) || 0

      updateInventoryItem({
        ...currentItem,
        stock,
        reorderLevel,
        stockStatus: Math.min(Math.round((stock / reorderLevel) * 100), 100),
      })

      setIsUpdateInventoryOpen(false)
      setCurrentItem(null)
      resetFormData()
    }
  }

  // Handle restock submission
  const handleRestock = () => {
    // In a real app, this would update the inventory with the new stock levels
    setIsRestockOpen(false)
    setSelectedItems([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsRestockOpen(true)}>
            Restock
          </Button>
          <Button
            onClick={() => {
              resetFormData()
              setIsUpdateInventoryOpen(true)
            }}
          >
            Update Inventory
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-zinc-500">Across 12 categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-zinc-500">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-zinc-500">Across 3 categories</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Monitor stock levels and reorder when necessary.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="w-full pl-8"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {inventoryFilter && <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>}
              </Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="hidden md:table-cell">Reorder Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.sku}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.reorderLevel}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={item.stockStatus}
                            className={`h-2 w-20 ${
                              item.stockStatus < 30
                                ? "bg-red-200"
                                : item.stockStatus < 70
                                  ? "bg-yellow-200"
                                  : "bg-green-200"
                            }`}
                          />
                          <span className="text-xs">{item.stockStatus}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateItem(item)}>
                          Update
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

      {/* Restock Dialog */}
      <UiDialog
        title="Restock Products"
        description="Add inventory to low stock products."
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestock}>Confirm Restock</Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Supplier
            </Label>
            <Select>
              <SelectTrigger id="supplier" className="col-span-3">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplier1">Main Supplier Inc.</SelectItem>
                <SelectItem value="supplier2">Wholesale Goods Ltd.</SelectItem>
                <SelectItem value="supplier3">Quality Products Co.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="order-date" className="text-right">
              Order Date
            </Label>
            <Input
              id="order-date"
              type="date"
              className="col-span-3"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expected-delivery" className="text-right">
              Expected Delivery
            </Label>
            <Input id="expected-delivery" type="date" className="col-span-3" />
          </div>

          <div className="my-2">
            <h3 className="mb-3 font-medium">Products to Restock</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {filteredInventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                    />
                    <Label htmlFor={`product-${item.id}`} className="font-normal">
                      {item.name}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`quantity-${item.id}`} className="sr-only">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      placeholder="Qty"
                      className="w-20"
                      defaultValue={item.stock < item.reorderLevel ? item.reorderLevel - item.stock : 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Notes
            </Label>
            <Input id="notes" placeholder="Additional notes" className="col-span-3" />
          </div>
        </div>
      </UiDialog>

      {/* Update Inventory Dialog */}
      <UiDialog
        title="Update Inventory"
        description="Adjust inventory levels for your products."
        isOpen={isUpdateInventoryOpen}
        onClose={() => setIsUpdateInventoryOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsUpdateInventoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateInventory}>Update Inventory</Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="update-type" className="text-right">
              Update Type
            </Label>
            <Select defaultValue="manual">
              <SelectTrigger id="update-type" className="col-span-3">
                <SelectValue placeholder="Manual Adjustment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Adjustment</SelectItem>
                <SelectItem value="stocktake">Stocktake</SelectItem>
                <SelectItem value="return">Customer Return</SelectItem>
                <SelectItem value="damaged">Damaged Goods</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {currentItem ? (
            <div className="my-2">
              <h3 className="mb-3 font-medium">Update {currentItem.name}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Current Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    className="col-span-3"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reorderLevel" className="text-right">
                    Reorder Level
                  </Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    className="col-span-3"
                    value={formData.reorderLevel}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="my-2">
              <h3 className="mb-3 font-medium">Products</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {filteredInventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`update-product-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                      />
                      <Label htmlFor={`update-product-${item.id}`} className="font-normal">
                        {item.name}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`current-${item.id}`} className="text-xs text-zinc-500">
                        Current: {item.stock}
                      </Label>
                      <Input
                        id={`new-quantity-${item.id}`}
                        type="number"
                        placeholder="New Qty"
                        className="w-20"
                        defaultValue={item.stock}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="reason" className="text-right pt-2">
              Reason
            </Label>
            <Input
              id="reason"
              placeholder="Reason for adjustment"
              className="col-span-3"
              value={formData.reason}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="adjustment-date" className="text-right">
              Date
            </Label>
            <Input id="date" type="date" className="col-span-3" value={formData.date} onChange={handleInputChange} />
          </div>
        </div>
      </UiDialog>

      {/* Filter Dialog */}
      <UiDialog
        title="Filter Inventory"
        description="Filter inventory by stock status."
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setInventoryFilter("")
                setIsFilterOpen(false)
              }}
            >
              Clear Filters
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock-filter" className="text-right">
              Stock Status
            </Label>
            <Select value={inventoryFilter} onValueChange={(value) => setInventoryFilter(value)}>
              <SelectTrigger id="stock-filter" className="col-span-3">
                <SelectValue placeholder={inventoryFilter || "All Stock Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Stock Status</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </UiDialog>
    </div>
  )
}


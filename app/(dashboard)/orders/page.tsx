"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Filter, Search, SortAsc, SortDesc } from "lucide-react"
import { UiDialog } from "@/components/ui-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useData, type Order } from "@/contexts/data-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function OrdersPage() {
  const { filteredOrders, orderSearch, setOrderSearch, orderFilter, setOrderFilter, orderSort, setOrderSort } =
    useData()

  const [isExportOrdersOpen, setIsExportOrdersOpen] = useState(false)
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [date, setDate] = useState<Date>()

  // Handle opening view dialog
  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order)
    setIsViewOrderOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button variant="outline" onClick={() => setIsExportOrdersOpen(true)}>
          <Download className="mr-2 h-4 w-4" />
          Export Orders
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full pl-8"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {orderFilter && <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {orderSort.includes("asc") ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    Sort
                    {orderSort && <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setOrderSort("date-asc")}>Date (Oldest First)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrderSort("date-desc")}>Date (Newest First)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrderSort("total-asc")}>Total (Low to High)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOrderSort("total-desc")}>Total (High to Low)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Shipped"
                                ? "secondary"
                                : order.status === "Processing"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          View
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

      {/* Export Orders Dialog */}
      <UiDialog
        title="Export Orders"
        description="Export your orders data in various formats."
        isOpen={isExportOrdersOpen}
        onClose={() => setIsExportOrdersOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsExportOrdersOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsExportOrdersOpen(false)}>Export</Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="export-format" className="text-right">
              Format
            </Label>
            <Select defaultValue="csv">
              <SelectTrigger id="export-format" className="col-span-3">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date Range</Label>
            <RadioGroup defaultValue="all" className="col-span-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last30" id="last30" />
                <Label htmlFor="last30">Last 30 Days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Range</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Start Date</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">End Date</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="export-status" className="text-right">
              Order Status
            </Label>
            <Select defaultValue="all">
              <SelectTrigger id="export-status" className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </UiDialog>

      {/* View Order Dialog */}
      <UiDialog
        title={`Order Details: ${currentOrder?.id || ""}`}
        description="View detailed information about this order."
        isOpen={isViewOrderOpen}
        onClose={() => {
          setIsViewOrderOpen(false)
          setCurrentOrder(null)
        }}
        footer={
          <Button
            onClick={() => {
              setIsViewOrderOpen(false)
              setCurrentOrder(null)
            }}
          >
            Close
          </Button>
        }
      >
        {currentOrder && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p className="text-sm">{currentOrder.customer}</p>
                <p className="text-sm text-muted-foreground">{currentOrder.address}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Order Information</h3>
                <p className="text-sm">Date: {currentOrder.date}</p>
                <p className="text-sm">
                  Status:
                  <Badge
                    variant={
                      currentOrder.status === "Delivered"
                        ? "default"
                        : currentOrder.status === "Shipped"
                          ? "secondary"
                          : currentOrder.status === "Processing"
                            ? "outline"
                            : "destructive"
                    }
                    className="ml-2"
                  >
                    {currentOrder.status}
                  </Badge>
                </p>
                <p className="text-sm">Payment Method: {currentOrder.paymentMethod}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrder.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right">${currentOrder.total.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Tax
                      </TableCell>
                      <TableCell className="text-right">${(currentOrder.total * 0.1).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">${(currentOrder.total * 1.1).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {currentOrder.notes && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm p-3 bg-muted rounded-md">{currentOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </UiDialog>

      {/* Filter Dialog */}
      <UiDialog
        title="Filter Orders"
        description="Filter orders by status and date."
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setOrderFilter("")
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
            <Label htmlFor="status-filter" className="text-right">
              Status
            </Label>
            <Select value={orderFilter} onValueChange={(value) => setOrderFilter(value)}>
              <SelectTrigger id="status-filter" className="col-span-3">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date Range</Label>
            <div className="col-span-3 space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </UiDialog>
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter } from "lucide-react"
import { UiDialog } from "@/components/ui-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useData, type User, type ValidationErrors } from "@/contexts/data-context"
import { useToastMessage } from "@/components/ui/toast-provider"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function UsersPage() {
  const {
    filteredUsers,
    userSearch,
    setUserSearch,
    userFilter,
    setUserFilter,
    addUser,
    updateUser,
    deleteUser,
    isLoading,
    setIsLoading,
  } = useData()

  const { showSuccess, showError } = useToastMessage()

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formErrors, setFormErrors] = useState<ValidationErrors>({})

  // Form state for add/edit user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    status: true,
  })

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      status: true,
    })
    setFormErrors({})
  }

  // Handle opening edit dialog
  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role.toLowerCase(),
      status: user.status === "Active",
    })
    setFormErrors({})
    setIsEditUserOpen(true)
  }

  // Handle opening delete dialog
  const handleDeleteUser = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })

    // Clear error for this field
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: "",
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      [id]: value,
    })

    // Clear error for this field
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: "",
      })
    }
  }

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked,
    })
  }

  // Handle add user submission
  const handleAddUser = async () => {
    setIsLoading(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const result = addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
        status: formData.status ? "Active" : "Inactive",
      })

      if (result.success) {
        showSuccess("User added successfully")
        setIsAddUserOpen(false)
        resetFormData()
      } else if (result.errors) {
        setFormErrors(result.errors)
      }
    } catch (error) {
      showError("Failed to add user")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle edit user submission
  const handleUpdateUser = async () => {
    if (!currentUser) return

    setIsLoading(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const result = updateUser({
        id: currentUser.id,
        name: formData.name,
        email: formData.email,
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
        status: formData.status ? "Active" : "Inactive",
      })

      if (result.success) {
        showSuccess("User updated successfully")
        setIsEditUserOpen(false)
        setCurrentUser(null)
        resetFormData()
      } else if (result.errors) {
        setFormErrors(result.errors)
      }
    } catch (error) {
      showError("Failed to update user")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete user
  const handleConfirmDelete = async () => {
    if (!currentUser) return

    setIsLoading(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      deleteUser(currentUser.id)
      showSuccess("User deleted successfully")
      setIsDeleteDialogOpen(false)
      setCurrentUser(null)
    } catch (error) {
      showError("Failed to delete user")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button
          onClick={() => {
            resetFormData()
            setIsAddUserOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage your team members and their account permissions here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full pl-8"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {userFilter && <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>}
              </Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <LoadingSpinner />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{user.role}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 focus:text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <UiDialog
        title="Add New User"
        description="Create a new user account and set their permissions."
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Create User
            </Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="name"
                placeholder="John Doe"
                className={formErrors.name ? "border-red-500" : ""}
                value={formData.name}
                onChange={handleInputChange}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={formErrors.email ? "border-red-500" : ""}
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="password"
                type="password"
                className={formErrors.password ? "border-red-500" : ""}
                value={formData.password}
                onChange={handleInputChange}
              />
              {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <div className="col-span-3 space-y-1">
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role" className={formErrors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && <p className="text-xs text-red-500">{formErrors.role}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Active
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch id="status" checked={formData.status} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="status">User is active</Label>
            </div>
          </div>
        </div>
      </UiDialog>

      {/* Edit User Dialog */}
      <UiDialog
        title="Edit User"
        description="Update user account details and permissions."
        isOpen={isEditUserOpen}
        onClose={() => setIsEditUserOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Update User
            </Button>
          </>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="name"
                placeholder="John Doe"
                className={formErrors.name ? "border-red-500" : ""}
                value={formData.name}
                onChange={handleInputChange}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={formErrors.email ? "border-red-500" : ""}
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="password"
                type="password"
                className={formErrors.password ? "border-red-500" : ""}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
              />
              {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <div className="col-span-3 space-y-1">
              <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                <SelectTrigger id="role" className={formErrors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && <p className="text-xs text-red-500">{formErrors.role}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Active
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch id="status" checked={formData.status} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="status">User is active</Label>
            </div>
          </div>
        </div>
      </UiDialog>

      {/* Filter Dialog */}
      <UiDialog
        title="Filter Users"
        description="Filter users by role and status."
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setUserFilter("")
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
            <Label htmlFor="role-filter" className="text-right">
              Role
            </Label>
            <Select value={userFilter} onValueChange={(value) => setUserFilter(value)}>
              <SelectTrigger id="role-filter" className="col-span-3">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status-filter" className="text-right">
              Status
            </Label>
            <Select value={userFilter} onValueChange={(value) => setUserFilter(value)}>
              <SelectTrigger id="status-filter" className="col-span-3">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </UiDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {currentUser ? ` "${currentUser.name}"` : ""} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


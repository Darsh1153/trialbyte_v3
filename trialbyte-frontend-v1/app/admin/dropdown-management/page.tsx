"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SearchableSelect, SearchableSelectOption } from '@/components/ui/searchable-select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  dropdownManagementAPI, 
  DropdownCategory, 
  DropdownOption 
} from '@/lib/dropdown-management-api';

export default function DropdownManagementConsole() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<DropdownCategory[]>([]);
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Dialog states
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DropdownCategory | null>(null);
  const [editingOption, setEditingOption] = useState<DropdownOption | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });
  const [optionForm, setOptionForm] = useState({
    categoryName: '',
    value: '',
    label: '',
    description: '',
    sortOrder: 0,
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, optionsResponse] = await Promise.all([
        dropdownManagementAPI.getCategories(),
        dropdownManagementAPI.getOptions(),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      if (optionsResponse.success && optionsResponse.data) {
        setOptions(optionsResponse.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dropdown data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Category management
  const handleCreateCategory = async () => {
    try {
      const response = await dropdownManagementAPI.createCategory(categoryForm);
      if (response.success) {
        toast({
          title: "Success",
          description: "Category created successfully",
        });
        setIsCategoryDialogOpen(false);
        setCategoryForm({ name: '', description: '' });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const response = await dropdownManagementAPI.updateCategory(editingCategory.id, {
        ...categoryForm,
        is_active: true,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
        setCategoryForm({ name: '', description: '' });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await dropdownManagementAPI.deleteCategory(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Option management
  const handleCreateOption = async () => {
    try {
      const response = await dropdownManagementAPI.createOption(optionForm);
      if (response.success) {
        toast({
          title: "Success",
          description: "Option created successfully",
        });
        setIsOptionDialogOpen(false);
        setOptionForm({ categoryName: '', value: '', label: '', description: '', sortOrder: 0 });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create option",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOption = async () => {
    if (!editingOption) return;

    try {
      const response = await dropdownManagementAPI.updateOption(editingOption.id, {
        ...optionForm,
        isActive: true,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Option updated successfully",
        });
        setIsOptionDialogOpen(false);
        setEditingOption(null);
        setOptionForm({ categoryName: '', value: '', label: '', description: '', sortOrder: 0 });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update option",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOption = async (id: number) => {
    try {
      const response = await dropdownManagementAPI.deleteOption(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Option deleted successfully",
        });
        loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete option",
        variant: "destructive",
      });
    }
  };

  // Filter and search
  const filteredOptions = options.filter(option => {
    const matchesSearch = !searchTerm || 
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || option.category_name === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoryOptions: SearchableSelectOption[] = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dropdown Management Console</h1>
        <div className="flex gap-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingOption(null);
                setOptionForm({ categoryName: '', value: '', label: '', description: '', sortOrder: 0 });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingOption ? 'Edit Option' : 'Add New Option'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="option-category">Category</Label>
                  <SearchableSelect
                    options={categoryOptions}
                    value={optionForm.categoryName}
                    onValueChange={(value) => setOptionForm({ ...optionForm, categoryName: value })}
                    placeholder="Select category"
                  />
                </div>
                <div>
                  <Label htmlFor="option-value">Value</Label>
                  <Input
                    id="option-value"
                    value={optionForm.value}
                    onChange={(e) => setOptionForm({ ...optionForm, value: e.target.value })}
                    placeholder="Enter option value"
                  />
                </div>
                <div>
                  <Label htmlFor="option-label">Label</Label>
                  <Input
                    id="option-label"
                    value={optionForm.label}
                    onChange={(e) => setOptionForm({ ...optionForm, label: e.target.value })}
                    placeholder="Enter option label"
                  />
                </div>
                <div>
                  <Label htmlFor="option-description">Description</Label>
                  <Textarea
                    id="option-description"
                    value={optionForm.description}
                    onChange={(e) => setOptionForm({ ...optionForm, description: e.target.value })}
                    placeholder="Enter option description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="option-sort">Sort Order</Label>
                  <Input
                    id="option-sort"
                    type="number"
                    value={optionForm.sortOrder}
                    onChange={(e) => setOptionForm({ ...optionForm, sortOrder: parseInt(e.target.value) || 0 })}
                    placeholder="Enter sort order"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsOptionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingOption ? handleUpdateOption : handleCreateOption}>
                    {editingOption ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingCategory(category);
                          setCategoryForm({
                            name: category.name,
                            description: category.description || '',
                          });
                          setIsCategoryDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge variant="secondary">
                  {options.filter(opt => opt.category_name === category.name).length} options
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Options Section */}
      <Card>
        <CardHeader>
          <CardTitle>Options ({filteredOptions.length})</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <SearchableSelect
                options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
                value={filterCategory}
                onValueChange={setFilterCategory}
                placeholder="Filter by category"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOptions.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>
                    <Badge variant="outline">{option.category_name}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{option.value}</TableCell>
                  <TableCell>{option.label}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {option.description || '-'}
                  </TableCell>
                  <TableCell>{option.sort_order}</TableCell>
                  <TableCell>
                    <Badge variant={option.is_active ? "default" : "secondary"}>
                      {option.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingOption(option);
                            setOptionForm({
                              categoryName: option.category_name || '',
                              value: option.value,
                              label: option.label,
                              description: option.description || '',
                              sortOrder: option.sort_order,
                            });
                            setIsOptionDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteOption(option.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

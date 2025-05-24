import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DataTable from 'react-data-table-component';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Edit, Trash } from 'lucide-react';

function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState({});
  const [editCategory, setEditCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Added state for search term
  const [isAdding, setIsAdding] = useState(false); // Added state for button disable
  const [isModalOpen, setIsModalOpen] = useState(false); // Added state for modal visibility
  const { data: session } = useSession();

  const fetchData = async () => {
    try {
      const result = await axios.get('/api/category', {
        params: { userEmail: session?.user?.email },
      });
      setCategories(result.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchData();
    }
    document.title = "Categories | ChillBill";

  }, [session]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!type.trim()) newErrors.type = 'Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsAdding(true); // Disable button and change text
    try {
      const response = await axios.post('/api/category', {
        name: name.trim(),
        type: type.trim(),
        userEmail: session?.user?.email,
      });
      setCategories([response.data, ...categories]);
      setName('');
      setType('');
      setErrors({});
      setIsModalOpen(false); // Close modal after adding
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setIsAdding(false); // Re-enable button and change text back
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put(`/api/category/?id=${editCategory._id}`, {
        ...editCategory,
        name: name.trim(),
        type: type.trim(),
      });
      setCategories(
        categories.map((cat) =>
          cat._id === editCategory._id ? response.data : cat
        )
      );
      setEditCategory(null);
      setName('');
      setType('');
      setErrors({});
      setIsModalOpen(false); // Close modal after editing
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/category/?id=${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setName(category.name);
    setType(category.type);
    setIsModalOpen(true); // Open modal on edit
  };

  const columns = [
    {
      name: 'ID',
      selector: (row) => row._id,
      sortable: true,
      omit: true,
      style: { fontSize: '16px', textTransform: 'capitalize' },
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
      style: { fontSize: '16px', textTransform: 'capitalize' },
    },
    {
      name: 'Type',
      selector: (row) => row.type,
      sortable: true,
      style: { fontSize: '16px', textTransform: 'capitalize' },
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="custom-button-v1 text-lg">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDelete(row._id)} className="custom-button-v1">
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  // Function to filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">View All Categories</h2>
          <button onClick={() => setIsModalOpen(true)} className="custom-button-v1">
            Add Category
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <DataTable
          className=""
          columns={columns}
          data={filteredCategories}
        />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
              <h3 className="text-xl font-semibold mb-4">
                {editCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <form onSubmit={editCategory ? handleEditSave : handleAdd} className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={`mt-1 block w-full border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    <option value="">Select a type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button type="submit" className={`custom-button-v1 ${isAdding ? 'cursor-not-allowed' : ''}`} disabled={isAdding}>
                    {isAdding ? 'Saving' : editCategory ? 'Save Changes' : 'Add Category'}
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setEditCategory(null);
                      setName('');
                      setType('');
                      setErrors({});
                      setIsModalOpen(false); // Close modal on cancel
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Category;

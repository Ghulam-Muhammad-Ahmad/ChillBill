import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DataTable from 'react-data-table-component';
import DashboardLayout from '@/components/DashboardLayout';

function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState({});
  const [editCategory, setEditCategory] = useState(null);
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

    try {
      const response = await axios.post('/api/category', {
        name: name.trim(),
        type: type.trim(),
        userEmail: session?.user?.email,
      });
      setCategories([...categories, response.data]);
      setName('');
      setType('');
      setErrors({});
    } catch (error) {
      console.error('Error adding category:', error);
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
  };

  const columns = [
    {
      name: 'ID',
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Type',
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="custom-button-v1"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="custom-button-v1"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center max-w-[1200px] mx-auto my-5">
          <h1 className="text-3xl font-bold">Category List</h1>
          {/* <button className="custom-button-v1">Add New</button> */}
        </div>
        <form
          className="flex gap-3 justify-stretch max-w-[1200px] mx-auto my-5 items-center"
          onSubmit={editCategory ? handleEditSave : handleAdd}
        >
          <div className="mb-4 w-1/2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full pl-3 pr-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-4 w-1/2">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            >
              <option value="">Select a type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}
          </div>
          <button type="submit" className="mt-4 custom-button-v1 w-[30%]">
            {editCategory ? 'Save Changes' : 'Add'}
          </button>
        </form>
        <DataTable
          title=""
          className="max-w-[1200px] mx-auto my-5 bg-white shadow-xl rounded-lg capitalize"
          columns={columns}
          data={categories}
        />
      </div>
    </DashboardLayout>
  );
}

export default Category;

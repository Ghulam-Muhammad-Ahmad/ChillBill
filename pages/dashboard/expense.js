import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DataTable from 'react-data-table-component';
import DashboardLayout from '@/components/DashboardLayout';
import { MonthContext } from '@/context/monthContext';
import { Edit, Trash } from 'lucide-react';

function Expense() {
  const { monthNumber } = useContext(MonthContext);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ amount: '', categoryId: '', date: '', description: '' });
  const [errors, setErrors] = useState({});
  const [editExpense, setEditExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { data: session } = useSession();

  const fetchExpenses = async () => {
    try {
      const result = await axios.get('/api/expense', {
        params: {
          userEmail: session?.user?.email,
          startDate: new Date(new Date().getFullYear(), monthNumber - 1, 1).toISOString(),
          endDate: new Date(new Date().getFullYear(), monthNumber, 0).toISOString(),
        },
      });
      setExpenses(result.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const fetchCategories = async () => {
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
      fetchExpenses();
      fetchCategories();
    }
    document.title = 'Expenses | ChillBill';
  }, [session, monthNumber]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = 'Valid amount is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      userEmail: session?.user?.email,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
    };

    try {
      setIsSaving(true);
      if (editExpense) {
        const response = await axios.put(`/api/expense/?id=${editExpense._id}`, payload);
        setExpenses(expenses.map((exp) => (exp._id === editExpense._id ? response.data : exp)));
      } else {
        const response = await axios.post('/api/expense', payload);
        setExpenses([response.data, ...expenses]);
      }

      setFormData({ amount: '', categoryId: '', date: '', description: '' });
      setEditExpense(null);
      setIsModalOpen(false);
      setErrors({});
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expense/?id=${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const openAddModal = () => {
    setEditExpense(null);
    setFormData({ amount: '', categoryId: '', date: '', description: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      categoryId: expense.categoryId,
      date: expense.date.split('T')[0],
      description: expense.description || '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const columns = [
    {
      name: 'Amount',
      selector: (row) => `${session?.user?.currency} ${new Intl.NumberFormat().format(row.amount)}`,
      sortable: true,
      style: { fontSize: '16px' },
    },
    {
      name: 'Category',
      selector: (row) => categories.find((cat) => cat._id === row.categoryId)?.name || 'Unknown',
      sortable: true,
      style: { fontSize: '16px' },
    },
    {
      name: 'Date',
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
      style: { fontSize: '16px' },
    },
    {
      name: 'Note',
      selector: (row) => row.description || '—',
      style: { fontSize: '16px' },
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(row)} className="custom-button-v1 text-lg">
            <Edit size={18} />
          </button>
          <button onClick={() => handleDelete(row._id)} className="custom-button-v1">
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  const filteredExpenses = expenses.filter((exp) =>
    exp.amount.toString().includes(searchTerm) ||
    exp.categoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(exp.date).toLocaleDateString().includes(searchTerm) ||
    exp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">View All Expenses</h2>
          <div className="flex gap-2">

            <button onClick={openAddModal} className="custom-button-v1">
              Add Expense
            </button>
            {/* <button onClick={() => setIsAiModalOpen(true)} className="custom-button-v1">
            USING AI
          </button> */}
          </div>
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

        <DataTable columns={columns} data={filteredExpenses} />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
              <h3 className="text-xl font-semibold mb-4">
                {editExpense ? 'Edit Expense' : 'Add Expense'}
              </h3>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount ({session?.user?.currency})</label>
                  <input
                    type="text"
                    value={
                      formData.amount
                        ? formData.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: e.target.value.replace(/,/g, '').replace(/[^0-9.]/g, '')
                      })
                    }
                    className={`mt-1 block w-full border ${errors.amount ? 'border-red-500' : 'border-gray-300'
                      } rounded-md shadow-sm px-3 py-2`}
                  />

                  {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`mt-1 block w-full border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2`}
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat.type === 'expense').map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`mt-1 block w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2`}
                  />
                  {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Note</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button type="submit" className={`custom-button-v1 ${isSaving ? 'cursor-not-allowed' : ''}`} disabled={isSaving}>
                    {isSaving ? 'Saving' : editExpense ? 'Save Changes' : 'Add Expense'}
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditExpense(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isAiModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
              <h3 className="text-xl font-semibold mb-4">Add Expense Using AI</h3>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Expense;
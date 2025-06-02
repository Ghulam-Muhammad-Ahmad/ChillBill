import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DataTable from 'react-data-table-component';
import DashboardLayout from '@/components/DashboardLayout';
import { MonthContext } from '@/context/monthContext';
import { Edit, Trash } from 'lucide-react';

function Income() {
  const { monthNumber } = useContext(MonthContext);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ amount: '', categoryId: '', date: '', note: '' });
  const [errors, setErrors] = useState({});
  const [editIncome, setEditIncome] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Added state for adding
  const [isSaving, setIsSaving] = useState(false); // Added state for saving
  const { data: session } = useSession();

  const fetchIncomes = async () => {
    try {
      const result = await axios.get('/api/income', {
        params: {
          userEmail: session?.user?.email,
          startDate: new Date(new Date().getFullYear(), monthNumber - 1, 1).toISOString(),
          endDate: new Date(new Date().getFullYear(), monthNumber, 0).toISOString(),
        },
      });
      setIncomes(result.data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
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
      fetchIncomes();
      fetchCategories();
    }
    document.title = 'Incomes | ChillBill';
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
      note: formData.note.trim(),
    };

    try {
      setIsSaving(true); // Set saving state
      if (editIncome) {
        const response = await axios.put(`/api/income/?id=${editIncome._id}`, payload);
        setIncomes(incomes.map((income) => (income._id === editIncome._id ? response.data : income)));
      } else {
        const response = await axios.post('/api/income', payload);
        setIncomes([response.data, ...incomes]);
      }

      setFormData({ amount: '', categoryId: '', date: '', note: '' });
      setEditIncome(null);
      setIsModalOpen(false);
      setErrors({});
    } catch (error) {
      console.error('Error submitting income:', error);
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/income/?id=${id}`);
      setIncomes(incomes.filter((income) => income._id !== id));
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const openAddModal = () => {
    setEditIncome(null);
    setFormData({ amount: '', categoryId: '', date: '', note: '' });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (income) => {
    setEditIncome(income);
    setFormData({
      amount: income.amount.toString(),
      categoryId: income.categoryId,
      date: income.date.split('T')[0],
      note: income.note || '',
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
      selector: (row) => row.note || '—',
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

  const filteredIncomes = incomes.filter((income) =>
    income.amount.toString().includes(searchTerm) ||
    income.categoryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(income.date).toLocaleDateString().includes(searchTerm) ||
    income.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">View All Incomes</h2>
            <button onClick={openAddModal} className="custom-button-v1">
              Add Income
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
          data={filteredIncomes}
        />

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
              <h3 className="text-xl font-semibold mb-4">
                {editIncome ? 'Edit Income' : 'Add Income'}
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
                      } rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />

                  {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`mt-1 block w-full border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat.type === 'income').map(cat => (
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
                    className={`mt-1 block w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Note</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button type="submit" className={`custom-button-v1 ${isSaving ? 'cursor-not-allowed' : ''}`} disabled={isSaving}>
                    {isSaving ? 'Saving' : editIncome ? 'Save Changes' : 'Add Income'}
                  </button>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditIncome(null);
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

export default Income;

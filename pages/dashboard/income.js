import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DataTable from 'react-data-table-component';
import DashboardLayout from '@/components/DashboardLayout';

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [editIncome, setEditIncome] = useState(null);
  const { data: session } = useSession();

  const fetchIncomes = async () => {
    try {
      const result = await axios.get('/api/income', {
        params: { userEmail: session?.user?.email },
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
  }, [session]);

  const validateForm = () => {
    const newErrors = {};
    if (!amount || isNaN(amount)) newErrors.amount = 'Valid amount is required';
    if (!categoryId) newErrors.categoryId = 'Category is required';
    if (!date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/income', {
        userEmail: session?.user?.email,
        amount: parseFloat(amount),
        categoryId,
        date,
        note: note.trim(),
      });
      setIncomes([...incomes, response.data]);
      setAmount('');
      setCategoryId('');
      setDate('');
      setNote('');
      setErrors({});
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put(`/api/income/?id=${editIncome._id}`, {
        ...editIncome,
        amount: parseFloat(amount),
        categoryId,
        date,
        note: note.trim(),
      });
      setIncomes(
        incomes.map((income) =>
          income._id === editIncome._id ? response.data : income
        )
      );
      setEditIncome(null);
      setAmount('');
      setCategoryId('');
      setDate('');
      setNote('');
      setErrors({});
    } catch (error) {
      console.error('Error editing income:', error);
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

  const handleEdit = (income) => {
    setEditIncome(income);
    setAmount(income.amount);
    setCategoryId(income.categoryId);
    setDate(income.date.split('T')[0]); // Format date for input
    setNote(income.note || '');
  };

  const columns = [
    {
      name: 'Amount',
      selector: (row) => `${session?.user?.currency} ${new Intl.NumberFormat().format(row.amount)}`,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row) => categories.find((cat) => cat._id === row.categoryId)?.name || 'Unknown',
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Note',
      selector: (row) => row.note || '—',
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
          <h1 className="text-3xl font-bold">Income List</h1>
        </div>
        <form
          className="flex flex-wrap gap-3 justify-stretch max-w-[1200px] mx-auto my-5 items-center"
          onSubmit={editIncome ? handleEditSave : handleAdd}
        >
          <div className="mb-4 w-full sm:w-1/4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ({session?.user?.currency})</label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`mt-1 block w-full pl-3 pr-3 py-2 border ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
          </div>
          <div className="mb-4 w-full sm:w-1/4">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            >
              <option value="">Select a category</option>
              {categories.filter(cat => cat.type === 'income').map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
          </div>
          <div className="mb-4 w-full sm:w-1/4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`mt-1 block w-full pl-3 pr-3 py-2 border ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>
          <div className="mb-4 w-full sm:w-1/4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
            <input
              type="text"
              name="note"
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button type="submit" className="mt-4 custom-button-v1">
            {editIncome ? 'Save Changes' : 'Add Income'}
          </button>
        </form>
        <DataTable
          title=""
          className="max-w-[1200px] mx-auto my-5 bg-white shadow-xl rounded-lg capitalize"
          columns={columns}
          data={incomes}
        />
      </div>
    </DashboardLayout>
  );
}

export default Income;

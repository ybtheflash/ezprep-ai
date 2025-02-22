// components/AdminPanel.tsx
'use client';
import { useEffect, useState } from 'react';
import { createRedemptionCode, deleteRedemptionCode, getRedemptionCodes } from '@/lib/actions/adminActions';

// First, let's add a proper type for the newCode state
interface NewCode {
  code: string;
  coins: number;
  maxUses: number;
  expiresAt: string;
}

export default function AdminPanel() {
  const [codes, setCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState<NewCode>({
    code: '',
    coins: 500,
    maxUses: 1,
    expiresAt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getRedemptionCodes();
      if (response.success) {
        setCodes(response.data);
      } else {
        setError(response.error || 'Failed to load codes');
      }
    } catch (error) {
      setError('Failed to load codes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await createRedemptionCode(newCode);
      if (response.success) {
        setSuccess('Code created successfully!');
        setNewCode({ code: '', coins: 500, maxUses: 1, expiresAt: '' });
        await loadCodes();
      } else {
        setError(response.error || 'Failed to create code');
      }
    } catch (error) {
      setError('Failed to create code');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this code?')) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await deleteRedemptionCode(id);
      if (response.success) {
        setSuccess('Code deleted successfully!');
        await loadCodes();
      } else {
        setError(response.error || 'Failed to delete code');
      }
    } catch (error) {
      setError('Failed to delete code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Create Code Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Redemption Code</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <input
                type="text"
                placeholder="SUMMER2024"
                value={newCode.code}
                onChange={(e) => setNewCode({...newCode, code: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Coins</label>
              <input
                type="number"
                value={newCode.coins.toString()} // Convert to string
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setNewCode({
                    ...newCode,
                    coins: isNaN(value) ? 0 : value
                  });
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Uses</label>
              <input
                type="number"
                value={newCode.maxUses.toString()} // Convert to string
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setNewCode({
                    ...newCode,
                    maxUses: isNaN(value) ? 1 : value
                  });
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiration</label>
              <input
                type="datetime-local"
                value={newCode.expiresAt}
                onChange={(e) => setNewCode({...newCode, expiresAt: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Code'}
          </button>
        </form>
      </div>

      {/* Codes List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Active Redemption Codes</h2>
          <button
            onClick={loadCodes}
            disabled={loading}
            className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium">Code</th>
                  <th className="p-3 text-left text-sm font-medium">Coins</th>
                  <th className="p-3 text-left text-sm font-medium">Uses/Max</th>
                  <th className="p-3 text-left text-sm font-medium">Expires</th>
                  <th className="p-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{code.code}</td>
                    <td className="p-3">{code.coins}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        code.uses >= code.maxUses ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {code.uses}/{code.maxUses}
                      </span>
                    </td>
                    <td className="p-3">
                      {code.expiresAt ? new Date(code.expiresAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(code._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
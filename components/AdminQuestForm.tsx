// components/admin/AddQuestForm.tsx
'use client'

import { addQuest } from '@/lib/actions/addQuest'
import { useState } from 'react'

export function AddQuestForm() {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: 'daily' | 'weekly';
    reward: number;
    completionGoal: number;
    resetDays: number;
  }>({
    title: '',
    description: '',
    type: 'weekly',
    reward: 0,
    completionGoal: 0,
    resetDays: 7 // Default to weekly
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const result = await addQuest(formData)
      if (result.success) {
        setMessage('Quest added successfully!')
        setFormData({
          title: '',
          description: '',
          type: 'weekly',
          reward: 0,
          completionGoal: 0,
          resetDays: 7
        })
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (error) {
      setMessage('Failed to add quest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#6d4a29]">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-[#DFD2BC] shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6d4a29]">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-[#DFD2BC] shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6d4a29]">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'daily' | 'weekly' })}
          className="mt-1 block w-full rounded-md border-[#DFD2BC] shadow-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6d4a29]">Reward (Coins)</label>
        <input
          type="number"
          value={formData.reward}
          onChange={(e) => setFormData({ ...formData, reward: +e.target.value })}
          className="mt-1 block w-full rounded-md border-[#DFD2BC] shadow-sm"
          min="0"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6d4a29]">Completion Goal</label>
        <input
          type="number"
          value={formData.completionGoal}
          onChange={(e) => setFormData({ ...formData, completionGoal: +e.target.value })}
          className="mt-1 block w-full rounded-md border-[#DFD2BC] shadow-sm"
          min="1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#6d4a29]">Reset Days</label>
        <input
          type="number"
          value={formData.resetDays}
          onChange={(e) => setFormData({ ...formData, resetDays: +e.target.value })}
          className="mt-1 block w-full rounded-md border-[#DFD2BC] shadow-sm"
          min="1"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#8b5e34] text-white px-4 py-2 rounded-md hover:bg-[#6d4a29] disabled:opacity-50"
      >
        {loading ? 'Adding Quest...' : 'Add Quest'}
      </button>

      {message && (
        <div className="mt-2 text-sm text-[#6d4a29]">
          {message}
        </div>
      )}
    </form>
  )
}
"use client"

import type React from "react"
import type { User } from "../../Types/User";
import { useState } from "react"

interface AddFloorModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFloor: (floorName: string) => void
  existingFloors: string[]
  user: User | null; // ✅ Thêm prop user
   setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function AddFloorModal({ isOpen, onClose, onAddFloor, existingFloors, user, setUser }: AddFloorModalProps) {
  const [floorName, setFloorName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!floorName.trim()) {
      setError("Floor name is required")
      return
    }

    if (existingFloors.includes(floorName.trim())) {
      setError("Floor already exists")
      return
    }

    onAddFloor(floorName.trim())
    setFloorName("")
    setError("")
    onClose()
  }

  const handleClose = () => {
    setFloorName("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {user ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Thêm tầng mới</h2>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="floorName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên tầng
            </label>
            <input
              type="text"
              id="floorName"
              value={floorName}
              onChange={(e) => {
                setFloorName(e.target.value)
                setError("")
              }}
              placeholder="e.g., B6, L1, P1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a9a4eb] focus:border-transparent"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Existing Floors Info */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Những tầng đang có:</p>
            <div className="flex flex-wrap gap-2">
              {existingFloors.map((floor) => (
                <span key={floor} className="px-2 py-1 bg-gradient-to-r from-[#a9a4eb]  to-[#6A63F0] text-white text-xs rounded">
                  {floor}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#a9a4eb] to-[#6A63F0]  text-white rounded-lg transition-colors"
            >
              Add Floor
            </button>
          </div>
        </form>
      </div>
    </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>

  )
}

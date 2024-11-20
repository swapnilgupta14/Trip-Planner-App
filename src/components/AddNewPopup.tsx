import React, { useState } from 'react';
import { usePackingContext } from '../context/AppContext';
import { Category } from '../types';
import { categoryColors } from './ItemCard';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
    const { dispatch } = usePackingContext();

    const [formData, setFormData] = useState({
        name: '',
        category: '' as Category | ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.category) {
            dispatch({
                type: 'ADD_ITEM',
                payload: {
                    id: crypto.randomUUID(),
                    name: formData.name,
                    category: formData.category,
                    isPacked: false
                }
            });
            setFormData({ name: '', category: '' });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-6">Add New Item</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Item Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter item name"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        >
                            <option value="">Select a category</option>
                            {(Object.keys(categoryColors) as Category[]).map((category) => (
                                <option key={category} value={category} className="capitalize">
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {formData.category && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Category Color
                            </label>
                            <div
                                className={`w-full h-8 rounded-lg ${categoryColors[formData.category]}`}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Add Item
                    </button>
                </form>
            </div>
        </div>
    );
}
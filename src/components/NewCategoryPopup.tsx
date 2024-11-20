import React, { useState } from 'react';
import { categoryColors } from './ItemCard';
import { X } from 'lucide-react';

interface NewCategoryPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewCategoryPopup = ({ isOpen, onClose }: NewCategoryPopupProps) => {
    const [categoryName, setCategoryName] = useState('');
    const [selectedColor, setSelectedColor] = useState('bg-gray-300');
    const [error, setError] = useState('');

    const predefinedColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-gray-500',
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            setError('Category name is required');
            return;
        }

        const newCategoryKey = categoryName.toLowerCase();

        if (categoryColors[newCategoryKey]) {
            setError('Category already exists');
            return;
        }

        categoryColors[newCategoryKey] = `${selectedColor} text-white`;

        console.log('Updated categories:', categoryColors);

        setCategoryName('');
        setSelectedColor('bg-gray-300');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold mb-6">Add New Category</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="categoryName"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Category Name
                        </label>
                        <input
                            id="categoryName"
                            type="text"
                            value={categoryName}
                            onChange={(e) => {
                                setCategoryName(e.target.value);
                                setError('');
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter category name"
                        />
                        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Category Color
                        </label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {predefinedColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-gray-600' : 'border-transparent'
                                        } ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                        </label>
                        <div className={`px-4 py-2 rounded-3xl shadow-lg ${selectedColor}`}>
                            <span className="text-white">
                                Item with {categoryName.length < 1 ? 'this category' : categoryName}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            Add Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCategoryPopup;

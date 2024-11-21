import { useState } from 'react';
import { usePackingContext } from '../context/AppContext';
import { Category } from '../types';
import { categoryColors } from './ItemCard';
import NewCategoryPopup from './NewCategoryPopup';

export default function CategoryFilter() {
    const { state, dispatch } = usePackingContext();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // type Category = keyof typeof categoryColors;
    const allCategories = Object.keys(categoryColors) as Category[];
    const categories: (Category | 'all')[] = ['all', ...allCategories];
    return (
        <>
            <div className="flex flex-1 ml-4 mt-2 mb-6 justify-between items-center">
                <div className='flex gap-2'>
                    {categories.map((category : Category | 'all', index) => (
                        <button
                            key={category}
                            onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category })}
                            className={`shadow-sm px-4 py-2 rounded-3xl ${state.selectedCategory === category
                                    ? `${categoryColors[category]}`
                                    : ` bg-white hover:bg-zinc-300`
                                } ${state.selectedCategory === "all" && index === 0 && "bg-black text-white"}`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className='px-6 py-2 rounded-3xl bg-white text-black hover:bg-black hover:text-white shadow-sm'
                >
                    <span>+ New Category</span>
                </button>
            </div>

            <NewCategoryPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
        </>
    );
}
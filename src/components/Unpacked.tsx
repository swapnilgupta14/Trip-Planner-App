import { usePackingContext } from '../context/AppContext';
import { Item } from '../types';
import ItemCard from './ItemCard';
import SearchInput from "./SearchInput"
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../components/ItemCard';
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

import { SORT_OPTIONS } from '../utils/SortOptions';

export default function Unpacked() {
    const { state, dispatch } = usePackingContext();
    const [currentSort, setCurrentSort] = useState('unsorted');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.PACKING_ITEM,
        drop: (item: { id: string }) => {
            dispatch({
                type: 'MOVE_ITEM',
                id: item.id,
                isPacked: false
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    const filterBySearch = (items: Item[]) => {
        if (!state.unpackedSearchQuery) return items;
        return items.filter(item =>
            item.name.toLowerCase().includes(state.unpackedSearchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(state.unpackedSearchQuery.toLowerCase())
        );
    };

    const topSuggestions = state.items.filter((item) => !item.isPacked && item.category === state.selectedCategory);
    const allItems: Item[] = state.items.filter((item) => !item.isPacked)
    const searchResults = filterBySearch(allItems);

    const currentSortFn = SORT_OPTIONS.find(
        option => option.id === currentSort
    )?.sortFn || SORT_OPTIONS[0].sortFn;

    const sortedSearchResults = currentSortFn(searchResults);
    const sortedTopSuggestions = currentSortFn(topSuggestions);
    const sortedAllItems = currentSortFn(allItems);

    const handleSortSelect = (sortId: string) => {
        setCurrentSort(sortId);
        setIsSortMenuOpen(false);
    };


    return (
        <div className="w-1/2 p-4 bg-white rounded min-h-[83vh] relative">
            <div className='flex justify-between items-center rounded-lg bg-gray-100 py-2 px-4 mb-4'>
                <h2 className="text-xl font-medium">
                    Unpacked Items ({allItems.length})
                </h2>
                <div className='flex gap-2 justify-between items-center'>
                    <SearchInput isPacked={false} />
                    <div className="relative">
                        <button
                            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                            className='bg-black py-1 px-4 text-white rounded-lg hover:bg-white hover:text-black flex items-center gap-2'
                        >
                            Sort By
                            <ChevronDown size={16} />
                        </button>
                        {isSortMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSortSelect(option.id)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                                    >
                                        {option.label}
                                        {currentSort === option.id && (
                                            <Check size={16} className="text-green-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                ref={drop}
                className={`min-h-[200px] p-2 ${isOver ? 'bg-gray-100 p-2 rounded-lg' : ''} transition-colors duration-200`}
            >
                {state.unpackedSearchQuery && (
                    <>
                        <h3 className="font-semibold mb-2 text-zinc-800">
                            Search Results ({sortedSearchResults.length})
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {sortedSearchResults.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
                {state.selectedCategory !== 'all' && sortedTopSuggestions.length > 0 && (
                    <>
                        <h3 className="font-semibold mb-6 text-zinc-800 capitalize">
                            Top Suggestions: {state.selectedCategory} ({sortedTopSuggestions.length})
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {sortedTopSuggestions.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
                {state.selectedCategory === 'all' && (
                    <>
                        <h3 className="font-semibold text-zinc-800 mb-4 p-1">
                            All Items
                        </h3>
                        <div className="flex flex-wrap gap-2 bg-transparent">
                            {sortedAllItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
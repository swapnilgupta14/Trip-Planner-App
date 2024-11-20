import { usePackingContext } from '../context/AppContext';
import { Item } from '../types';
import ItemCard from './ItemCard';
import SearchInput from "./SearchInput"
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../components/ItemCard';

export default function Unpacked() {
    const { state, dispatch } = usePackingContext();

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

    return (
        <div className="w-1/2 p-4 bg-gray-100 rounded min-h-[83vh]">
            <div className='flex justify-between items-center rounded-lg bg-gray-200 py-2 px-4 mb-4'>
                <h2 className="text-xl font-medium">Unpacked Items ({allItems.length})</h2>
                <div>
                    <SearchInput isPacked={false} />
                </div>
            </div>
            <div
                ref={drop}
                className={`min-h-[200px] ${isOver ? 'bg-gray-200' : ''} transition-colors duration-200`}
            >
                {state.unpackedSearchQuery && (
                    <>
                        <h3 className="font-semibold mb-2 text-zinc-800">
                            Search Results ({searchResults.length})
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {searchResults.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
                {state.selectedCategory !== 'all' && topSuggestions.length > 0 && (
                    <>
                        <h3 className="font-semibold mb-6 text-zinc-800 capitalize">
                            Top Suggestions: {state.selectedCategory} ({topSuggestions.length})
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {topSuggestions.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
                {state.selectedCategory === 'all' && (
                    <>
                        <h3 className="font-semibold text-zinc-800 mb-4 p-1">All Items</h3>
                        <div className="flex flex-wrap gap-2">
                            {allItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
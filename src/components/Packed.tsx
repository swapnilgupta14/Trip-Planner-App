import { usePackingContext } from '../context/AppContext';
import { GroupedItems, Item } from '../types';
import ItemCard from './ItemCard';
import SearchInput from "./SearchInput";
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../components/ItemCard';
import { useMemo } from 'react';

export default function PackedItems() {
    const { state, dispatch } = usePackingContext();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.PACKING_ITEM,
        drop: (item: { id: string }) => {
            dispatch({
                type: 'MOVE_ITEM',
                id: item.id,
                isPacked: true
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    const filterBySearch = (items: Item[]) => {
        if (!state.packedSearchQuery) return items;
        return items.filter(item =>
            item.name.toLowerCase().includes(state.packedSearchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(state.packedSearchQuery.toLowerCase())
        );
    };

    const handleUnpackAll = () => {
        dispatch({
            type: "UNPACK_ALL",
        });
    };

    const packedItems = state.items.filter((item) => item.isPacked);
    const searchResults = filterBySearch(packedItems);

    const initialGroupedItems: GroupedItems = {
        clothing: [],
        electronics: [],
        toiletries: [],
        documents: [],
        accessories: [],
        stationary: [],
        health: [],
        food: [],
        books: [],
    };

    const groupItemsByCategory = (items: Item[]) => {
        return items.reduce((acc, item) => {
            acc[item.category].push(item);
            return acc;
        }, { ...initialGroupedItems });
    };

    const itemsByCategory = groupItemsByCategory(searchResults);

    const filteredResult = useMemo(() => {
        return Object.entries(itemsByCategory).filter(([_, items]) => items.length > 0);
    }, [itemsByCategory]);

    return (
        <div className="w-1/2 p-4 bg-white rounded min-h-[83vh]">
            <div className='flex justify-between items-center rounded-lg bg-gray-100 py-2 px-4 mb-4'>
                <h2 className="text-xl font-medium">Packed Items ({searchResults.length})</h2>
                <div className='flex gap-4 justify-between items-center'>
                    <SearchInput isPacked={true} />
                    <button
                        className='bg-black py-1 px-4 text-white rounded-lg hover:bg-white hover:text-black'
                        onClick={handleUnpackAll}
                    >
                        Unpack All
                    </button>
                </div>
            </div>
            <div
                ref={drop}
                className={`min-h-[200px] ${isOver ? 'bg-gray-200' : ''} transition-colors duration-200 py-2`}
            >

                {searchResults.length === 0 && <p>No Packed Items</p>}

                {state.packedSearchQuery && (
                    <>
                        <h3 className="font-semibold mb-2 text-zinc-800 p-2">
                            Search Results ({searchResults.length})
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4 p-2">
                            {searchResults.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </>
                )}

                {!state.packedSearchQuery && filteredResult.map(([category, items]) => (
                    <div key={category} className="mb-4 bg-gray-100 rounded-lg p-4">
                        <h3 className="mb-4 capitalize">{category} ({items.length})</h3>
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
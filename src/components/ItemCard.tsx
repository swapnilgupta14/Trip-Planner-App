import { useState } from 'react';
import { usePackingContext } from '../context/AppContext';
import { Item } from '../types';
import { Pencil } from 'lucide-react';
import { useDrag } from 'react-dnd';

export const ItemTypes = {
    PACKING_ITEM: 'PACKING_ITEM'
} as const;


export const categoryColors: Record<string, string> = {
    clothing: 'bg-blue-100 text-blue-900',
    electronics: 'bg-zinc-300',
    toiletries: 'bg-yellow-100 text-yellow-900',
    documents: 'bg-red-100 text-red-900',
    accessories: 'bg-purple-100 text-purple-900',
    stationary: 'bg-orange-100 text-orange-900',
    health: "bg-green-100 text-green-900",
    food: "bg-cyan-100 text-cyan-900",
    books: "bg-fuchsia-100 text-fuchsia-950"
};

export default function ItemCard({ item }: { item: Item }) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.PACKING_ITEM,
        item: { id: item.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    // console.log(item)
    const { dispatch } = usePackingContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(item.name);
    const [error, setError] = useState("");
    const [isHovering, setIsHovering] = useState(false);

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (!editedName.trim()) {
            setError("Item name cannot be empty");
            return;
        }

        dispatch({
            type: 'EDIT_ITEM_NAME',
            payload: { id: item.id, name: editedName.trim() }
        });
        setIsEditing(false);
        setError("");
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsEditing(false);
        setEditedName(item.name);
        setError("");
    };

    const handleInputClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const customEvent = { stopPropagation: () => { } } as React.MouseEvent<HTMLButtonElement>;
            handleSave(customEvent);
        } else if (e.key === 'Escape') {
            const customEvent = { stopPropagation: () => { } } as React.MouseEvent<HTMLButtonElement>;
            handleCancel(customEvent);
        }
    };

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="cursor-move bg-transparent rounded-xl"
        >
            <div className="relative">
                <div
                    className={`group w-fit px-6 py-2 rounded-xl flex justify-between items-center text-center cursor-pointer 
                ${categoryColors[item.category]} hover:shadow-md transition-shadow relative`}
                    onClick={() => !isEditing && dispatch({ type: 'TOGGLE_PACK', payload: item.id })}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {isEditing ? (
                        <div className="flex items-center gap-2" onClick={handleInputClick}>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => {
                                    setEditedName(e.target.value);
                                    if (e.target.value.trim()) setError("");
                                }}
                                onKeyDown={handleKeyPress}
                                className="px-2 py-1 rounded border bg-white text-gray-900 w-full min-w-[80px]
                                     focus:outline-none focus:ring-1 focus:ring-black"
                                autoFocus
                            />
                            <button
                                onClick={handleSave}
                                className="p-1 rounded-full bg-green-200 transition-colors"
                                title="Save"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-1 rounded-full bg-red-200 transition-colors"
                                title="Cancel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <span>{item.name}</span>
                            {item.isPacked && (
                                <span className="text-black ml-2">×</span>
                            )}
                            {isHovering && !isEditing && (
                                <button
                                    onClick={handleEditClick}
                                    className="absolute right-0 bottom-0 p-1 rounded-l-xl rounded-b-xl rounded-t-xl bg-white 
                                         transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                                    title="Edit"
                                >
                                    <Pencil className="h-3 w-3 text-black" />
                                </button>
                            )}
                        </>
                    )}
                </div>
                {error && (
                    <div className="absolute left-0 -bottom-6 text-red-500 text-xs whitespace-nowrap">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
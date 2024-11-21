import { useState, useRef, useEffect } from 'react';
import { usePackingContext } from '../context/AppContext';
import { Item, ItemTag } from '../types';
import { useDrag } from 'react-dnd';
import { Pencil, Tag, Star, Edit, Heart } from 'lucide-react';

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

    const { dispatch } = usePackingContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(item.name);
    const [error, setError] = useState("");
    const [isHovering, setIsHovering] = useState(false);


    const [contextMenu, setContextMenu] = useState<{
        visible: boolean,
        x: number,
        y: number,
        subMenu?: string
    }>({
        visible: false,
        x: 0,
        y: 0,
        subMenu: undefined
    });
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touchTimer = setTimeout(() => {
            const touch = e.touches[0];
            setContextMenu({
                visible: true,
                x: touch.clientX,
                y: touch.clientY
            });
        }, 500);

        e.currentTarget.addEventListener('touchend', () => clearTimeout(touchTimer), { once: true });
        e.currentTarget.addEventListener('touchmove', () => clearTimeout(touchTimer), { once: true });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu(prev => ({ ...prev, visible: false, subMenu: undefined }));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = (tag: ItemTag) => {
        console.log("tags:", tag);
        dispatch({
            type: 'ADD_ITEM_TAG',
            payload: { id: item.id, tag }
        });
        setContextMenu(prev => ({ ...prev, visible: false, subMenu: undefined }));
    };

    const openEditMode = () => {
        setIsEditing(true);
        setContextMenu({ visible: false, x: 0, y: 0 });
    };

    const renderContextMenu = () => {
        if (!contextMenu.visible) return null;

        return (
            <div
                ref={contextMenuRef}
                className="fixed z-50 bg-white shadow-lg rounded-lg border"
                style={{
                    top: contextMenu.y,
                    left: contextMenu.x,
                    transform: 'translate(-50%, 10px)'
                }}
            >
                {!contextMenu.subMenu && (
                    <div className="p-2 min-w-[200px]">
                        <div
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setContextMenu(prev => ({ ...prev, subMenu: 'tags' }))
                            }>
                            <Tag className="mr-2 h-4 w-4" />
                            Add Tags
                        </div>
                        <div
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={openEditMode}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                        </div>
                    </div>
                )}

                {contextMenu.subMenu === 'tags' && (
                    <div className="p-2 min-w-[200px]">
                        <div
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => addTag('essential')}
                        >
                            <Star className="mr-2 h-4 w-4 text-yellow-500" />
                            Essential Item
                        </div>
                        <div
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => addTag('favorite')}
                        >
                            <Heart className="mr-2 h-4 w-4 text-red-500" />
                            Favorite
                        </div>
                        <div
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setContextMenu(prev => ({ ...prev, subMenu: 'customTag' }))
                            }>
                            <Tag className="mr-2 h-4 w-4" />
                            Custom Tag
                        </div>
                    </div>
                )}

                {contextMenu.subMenu === 'customTag' && (
                    <div className="p-2 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Enter custom tag"
                            className="w-full p-2 border rounded mb-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setContextMenu(prev => ({ ...prev, visible: false, subMenu: undefined }));
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

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
            className={`cursor-move bg-transparent rounded-xl mb-2`}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
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

                            {item.tags?.length !== undefined && item.tags?.length > 0 && (item.tags?.map((eachtag) =>
                                <button
                                    key={item.id + 'tagID'}
                                    className={`absolute left-0 -bottom-2 p-1 rounded-l-xl rounded-b-xl rounded-t-xl bg-white border-2 border-${categoryColors[item.category].split("bg-")[1]} transition-colors shadow-sm`}
                                    title="Tags"
                                >
                                    {eachtag === "essential" ? (
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    ) : (
                                        <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                                    )}

                                </button>
                            ))


                            }

                            {item.isPacked && (
                                <span className="text-black ml-2 bg-white p-1 pt-2 rounded-full h-4 w-4 flex flex-col items-center justify-center">×</span>
                            )}
                            {isHovering && !isEditing && (
                                <button
                                    onClick={handleEditClick}
                                    className="absolute -right-1 -bottom-1 p-1 rounded-l-xl rounded-b-xl rounded-t-xl bg-white 
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
            {renderContextMenu()}
        </div>
    );
}
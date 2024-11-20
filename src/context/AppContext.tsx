import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { initialItems } from '../items';
import { State, Action, PackingContextType, Activity } from '../types';
import { toast } from 'react-toastify';

const PackingContext = createContext<PackingContextType | undefined>(undefined);

const initialState: State = {
    items: initialItems,
    selectedCategory: 'all',
    unpackedSearchQuery: '',
    packedSearchQuery: '',
    activityLog: [],
};

const showToastForAction = (action: Action, state: State) => {
    switch (action.type) {
        case 'TOGGLE_PACK':
            const item = state.items.find(item => item.id === action.payload);
            if (item) {
                toast.success(`${item.name} ${!item.isPacked ? 'packed' : 'unpacked'} successfully!`);
            }
            break;

        case 'ADD_ITEM':
            toast.success(`${action.payload.name} added to your packing list!`);
            break;

        case 'EDIT_ITEM_NAME':
            const editedItem = state.items.find(item => item.id === action.payload.id);
            if (editedItem && editedItem.name !== action.payload.name) {
                toast.success(`Item renamed from "${editedItem.name}" to "${action.payload.name}"`);
            }
            break;

        case "UNPACK_ALL":
            const hasPackedItems = state.items.some(item => item.isPacked);
            if (hasPackedItems) {
                toast.success("All items unpacked!");
            }
            break;
        case "MOVE_ITEM":
            const movedItem = state.items.find(item => item.id === action.id);
            if (movedItem) {
                toast.success(`${movedItem.name} ${action.isPacked ? 'packed' : 'unpacked'}!`);
            }
            break;
    }
};

function packingReducer(state: State, action: Action): State {
    switch (action.type) {

        case 'SET_CATEGORY':
            return { ...state, selectedCategory: action.payload };

        case 'SET_UNPACKED_SEARCH_QUERY':
            return { ...state, unpackedSearchQuery: action.payload };

        case 'SET_PACKED_SEARCH_QUERY':
            return { ...state, packedSearchQuery: action.payload };

        case 'ADD_ITEM': {
            const newActivity: Activity = {
                id: crypto.randomUUID(),
                type: 'ADD_ITEM',
                itemId: action.payload.id,
                timestamp: new Date().toISOString()
            };
            return {
                ...state,
                items: [...state.items, action.payload],
                activityLog: [newActivity, ...state.activityLog]
            };
        }

        case 'TOGGLE_PACK': {
            const item = state.items.find(item => item.id === action.payload);
            if (!item) return state;

            const newActivity: Activity = {
                id: crypto.randomUUID(),
                type: item.isPacked ? 'UNPACK' : 'PACK',
                itemId: action.payload,
                timestamp: new Date().toISOString()
            };
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload
                        ? { ...item, isPacked: !item.isPacked }
                        : item
                ),
                activityLog: [newActivity, ...state.activityLog]
            };
        }

        case 'EDIT_ITEM_NAME': {
            const oldItem = state.items.find(item => item.id === action.payload.id);
            const newActivity: Activity = {
                id: crypto.randomUUID(),
                type: 'EDIT_ITEM',
                itemId: action.payload.id,
                timestamp: new Date().toISOString(),
                details: {
                    oldName: oldItem?.name,
                    newName: action.payload.name
                }
            };
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, name: action.payload.name }
                        : item
                ),
                activityLog: [newActivity, ...state.activityLog]
            };
        }

        case "UNPACK_ALL":

            return {
                ...state,
                items: state.items.map(item => ({
                    ...item,
                    isPacked: false,
                })),
            };

        case "MOVE_ITEM":
            const item = state.items.find(item => item.id === action.id);
            if (!item) return state;

            const newActivity: Activity = {
                id: crypto.randomUUID(),
                type: item.isPacked ? 'UNPACK' : 'PACK',
                itemId: action.id,
                timestamp: new Date().toISOString()
            };
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.id
                        ? { ...item, isPacked: action.isPacked }
                        : item
                ),
                activityLog: [newActivity, ...state.activityLog]
            };


        default:
            return state;
    }
}

export function PackingProvider({ children }: { children: React.ReactNode }) {
    const [state, baseDispatch] = useReducer(packingReducer, initialState);

    const dispatch = useCallback((action: Action) => {
        showToastForAction(action, state);
        baseDispatch(action);
    }, [state]);

    return (
        <PackingContext.Provider value={{ state, dispatch }}>
            {children}
        </PackingContext.Provider>
    );
}

export function usePackingContext() {
    const context = useContext(PackingContext);
    if (!context) {
        throw new Error('usePackingContext must be used within a PackingProvider');
    }
    return context;
}
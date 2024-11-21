import { Item } from "../types";
export const SORT_OPTIONS = [
    {
        id: 'unsorted',
        label: 'Default',
        sortFn: (items: Item[]) => items
    },
    {
        id: 'alphabetical',
        label: 'Alphabetical (A-Z)',
        sortFn: (items: Item[]) => [...items].sort((a, b) =>
            a.name.localeCompare(b.name))
    },
    {
        id: 'category',
        label: 'By Category',
        sortFn: (items: Item[]) => [...items].sort((a, b) =>
            a.category.localeCompare(b.category))
    },
    {
        id: 'tags',
        label: 'By Tags',
        sortFn: (items: Item[]) => [...items].sort((a, b) =>
            (a.tags || []).length - (b.tags || []).length)
    }
];
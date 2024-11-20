import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import UnpackedItems from '../components/Unpacked';
import PackedItems from '../components/Packed';
import AddNewPopup from '../components/AddNewPopup';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="ml-[4%] w-[96%] container mx-auto p-4 select-none">
                <div className='w-full flex justify-between items-baseline'>
                    <CategoryFilter />
                    <button
                        className='rounded-3xl bg-black text-white py-2 px-4 mx-4 hover:bg-white hover:border-black border-2 hover:text-black'
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add New Item
                    </button>
                </div>
                <div className="flex gap-4">
                    <UnpackedItems />
                    <PackedItems />
                </div>
                <AddNewPopup
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </DndProvider>
    );
};

export default Dashboard;
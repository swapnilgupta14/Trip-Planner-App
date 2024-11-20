import { usePackingContext } from '../context/AppContext';
import { Clock, Plus, PackageCheck, PackageX } from 'lucide-react';
import { State, Item, Category } from '../types';

type ActivityType = 'ADD_ITEM' | 'PACK' | 'UNPACK' | 'UNPACK_ALL' | 'EDIT_ITEM';

interface Activity {
    id: string;
    type: ActivityType;
    itemId: string;
    timestamp: string;
    details?: {
        oldName?: string;
        newName?: string;
    };
}

interface ExtendedState extends State {
    activityLog: Activity[];
}

const ActivityLog = () => {
    const { state } = usePackingContext();
    const { activityLog = [], items } = state as ExtendedState;

    const groupedActivities = activityLog.reduce<Record<string, Activity[]>>((groups, activity) => {
        const date = new Date(activity.timestamp).toLocaleDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(activity);
        return groups;
    }, {});

    const recentlyAdded = activityLog
        .filter(activity => {
            const isRecent = Date.now() - new Date(activity.timestamp).getTime() < 24 * 60 * 60 * 1000;
            return activity.type === 'ADD_ITEM' && isRecent;
        })
        .map(activity => items.find(item => item.id === activity.itemId))
        .filter((item): item is Item => item !== undefined);

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case 'ADD_ITEM':
                return <Plus className="w-5 h-5 text-green-600" />;
            case 'PACK':
                return <PackageCheck className="w-5 h-5 text-blue-600" />;
            case 'UNPACK':
            case 'UNPACK_ALL':
                return <PackageX className="w-5 h-5 text-orange-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getActivityMessage = (activity: Activity): string => {
        const item = items.find(item => item.id === activity.itemId);
        const itemName = item?.name || 'Unknown item';
        
        switch (activity.type) {
            case 'ADD_ITEM':
                return `Added "${itemName}" to the list`;
            case 'PACK':
                return `Packed "${itemName}"`;
            case 'UNPACK':
                return `Unpacked "${itemName}"`;
            case 'UNPACK_ALL':
                return 'Unpacked all items';
            case 'EDIT_ITEM':
                return `Renamed "${activity.details?.oldName}" to "${activity.details?.newName}"`;
            default:
                return 'Unknown action';
        }
    };

    const getCategoryBadgeColor = (category: Category): string => {
        const colors: Record<Category, string> = {
            clothing: 'bg-blue-100 text-blue-800',
            electronics: 'bg-purple-100 text-purple-800',
            toiletries: 'bg-green-100 text-green-800',
            documents: 'bg-yellow-100 text-yellow-800',
            accessories: 'bg-pink-100 text-pink-800',
            stationary: 'bg-indigo-100 text-indigo-800',
            health: 'bg-red-100 text-red-800',
            food: 'bg-orange-100 text-orange-800',
            books: 'bg-teal-100 text-teal-800'
        };
        return colors[category];
    };

    return (
        <div className="ml-[4%] w-[96%] container mx-auto p-4 space-y-6">
            {recentlyAdded.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentlyAdded.map(item => (
                            <div 
                                key={item.id} 
                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-md"
                            >
                                <Plus className="w-4 h-4 text-green-600" />
                                <span className="flex-1">{item.name}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(item.category)}`}>
                                    {item.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Activity History</h2>
                <div className="space-y-6">
                    {Object.entries(groupedActivities).map(([date, activities]) => (
                        <div key={date} className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-500">{date}</h3>
                            <div className="space-y-2">
                                {activities.map((activity) => (
                                    <div 
                                        key={activity.id} 
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                                    >
                                        {getActivityIcon(activity.type)}
                                        <span className="flex-1">{getActivityMessage(activity)}</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(activity.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
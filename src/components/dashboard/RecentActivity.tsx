import React, { useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { DataContext } from '../../context/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const actionIcons = {
    created: <PlusCircle className="h-4 w-4 text-green-500" />,
    updated: <Edit className="h-4 w-4 text-blue-500" />,
    deleted: <Trash2 className="h-4 w-4 text-red-500" />,
};

const RecentActivity: React.FC = () => {
    const dataContext = useContext(DataContext);
    if (!dataContext) return null;

    const { activities } = dataContext;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of the most recent changes made in the application.</CardDescription>
            </CardHeader>
            <CardContent>
                {activities.length > 0 ? (
                    <ul className="space-y-4">
                        {activities.slice(0, 10).map(activity => (
                            <li key={activity.id} className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    {actionIcons[activity.action]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold capitalize">{activity.user_name.toLowerCase()}</span>
                                        {' '}{activity.action}
                                        {' '}<span className="font-semibold">{activity.target}</span>.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        No recent activity to display. Make a change to see it here!
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentActivity;

import React, { useState, useEffect } from 'react';
import { doc, collection, query, orderBy, limit, onSnapshot, updateDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { PencilIcon, FolderIcon, UserCircleIcon, } from '@heroicons/react/solid';
import { Link } from 'iconsax-react';



const Dashboard = ({ currentUser }) => {
    const [activeUsers, setActiveUsers] = useState([]);
    const [newSubscribers, setNewSubscribers] = useState([]);
    const [lastLoginTime, setLastLoginTime] = useState(null);

    useEffect(() => {
        if (!currentUser?.uid) return;

        // Update user's status to online and last login time
        const userRef = doc(firestore, "users", currentUser.uid);
        updateDoc(userRef, {
            status: 'online',
            lastLogin: serverTimestamp()
        });

        // Cleanup on unmount - set user offline
        return () => {
            updateDoc(userRef, {
                status: 'offline',
                lastSeen: serverTimestamp()
            });
        };
    }, [currentUser]);

    useEffect(() => {
        // Listen to active users
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("status", "in", ["online", "offline"]));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                lastLoginFormatted: formatTimestamp(doc.data().lastLogin)
            }));
            setActiveUsers(users);
        });

        return () => unsubscribe();
    }, []);


    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Never';

        const date = timestamp.toDate();
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const hours = Math.floor(diffTime / (1000 * 60 * 60));
            if (hours === 0) {
                const minutes = Math.floor(diffTime / (1000 * 60));
                return `${minutes} minutes ago`;
            }
            return `${hours} hours ago`;
        } else if (diffDays === 1) {
            return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        }
        return `${diffDays} days ago, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="space-y-6 bg-white">
            {/* Welcome Section */}
            <div className="p-6 flex justify-center items-center">
                {/* Welcome Message */}
                <div className='w-full'>
                    <h1 className="text-xl font-bold mb-2 text-center">
                        TakaCycle Portal
                    </h1>
                    <p className="text-gray-700 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-3 text-sm text-center" >
                        <strong className="text-yellow-700">⚠️ Important Notice:</strong>
                        <br /><br />
                        Only <span className="font-semibold text-gray-900">one person</span> with <span className="font-semibold text-green-600">&ldquo;Online&rdquo; status</span> should make changes to a page at a time.
                        <br />
                        Always click <span className="font-semibold text-blue-600">&ldquo;Publish&rdquo;</span> to save new entries and <span className="font-semibold text-purple-600">&ldquo;Update&rdquo;</span> to modify existing ones.
                        <br />
                        <span className="text-red-600 font-bold">Be cautious</span> when clicking <span className="text-red-700 font-semibold">&ldquo;Delete&rdquo;</span>—<span className="font-semibold">deleted items cannot be retrieved.</span>
                    </p>


                </div>
            </div>

            {/* Quick Access Cards */}
            <div className='justify-center  items-center'>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <QuickAccessCard
                        title="Users"
                        subtitle="3"
                        icon={<UserCircleIcon className="w-6 h-6 text-white" />}
                        bgColor="bg-orange-500"
                        href="/portal/blog/create"
                    />
                    <QuickAccessCard
                        title="Blogs Published"
                        subtitle="3"
                        icon={<PencilIcon className="w-6 h-6 text-white" />}
                        bgColor="bg-green-500"
                        href="/portal/blog/create"
                    />
                    <QuickAccessCard
                        title="Project Published"
                        subtitle="3"
                        icon={<FolderIcon className="w-6 h-6 text-white" />}
                        bgColor="bg-blue-500"
                        href="/portal/blog/create"
                    />
                    <QuickAccessCard
                        title="Project Published"
                        subtitle="3"
                        icon={<FolderIcon className="w-6 h-6 text-white" />}
                        bgColor="bg-purple-500"
                        href="/portal/blog/create"
                    />


                </div>
            </div>


            {/* Activity Tracking Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-medium text-gray-700">
                {/* Active Users Card */}
                <div className="bg-white p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">User Activity</h2>
                    <div className="overflow-x-auto h-[20vh]">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeUsers.map(user => (
                                    <tr key={user.id} className="border-t">
                                        <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                                        <td className="px-4 py-2">
                                            <span className="flex items-center">
                                                <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {user.status === 'online' ? 'Online' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{user.lastLoginFormatted}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Other Card */}
            </div>
        </div>
    );
};

const QuickAccessCard = ({ title, icon, bgColor, href, subtitle }) => (

    <div

        className={`${bgColor} p-6 rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-3 w-46 h-16 mb-2 
              mr-4 py-2 px-4
               border-0
              text-sm font-semibold
              bg-brandTextGreen 
              `}
    >
        {icon}
        <span className=" text-white">{title}</span>
        <span className=" text-white font-semibold">{subtitle}</span>
    </div>


);

export default Dashboard;
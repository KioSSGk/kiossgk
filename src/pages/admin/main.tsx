import React, { useEffect, useState } from 'react';
import AdminMainPage from '../components/admin/MainPage';
import HeaderIcon from '../components/admin/HeaderIcon';
import { useRouter } from 'next/router';
import useAuth from '@/lib/useAuth'; // Assuming you have an Auth context set up
interface User{
    id:number;
    email:string;
    iat:number;
    exp:number;

}
const AdminMain: React.FC = () => {
   
    const { user } = useAuth(); // Get the user from the authentication context
    const router = useRouter();
    const [loading, setLoading] = useState(true); // State to handle loading spinner


    useEffect(() => {
        if (user === null) {
            // If user is not logged in, redirect to the login page
            setTimeout(() => {
            router.push('/admin/login');},2000);
        } else {
            // Once user is authenticated, stop the loading spinner
            setTimeout(() => {
            setLoading(false);
            console.log("메인에서 불러온",user);
            if (user !== undefined){
            router.push(`/admin/${user.id}/main`);}},2000);
        }
    }, [user, router]);

    if (loading) {
        // Display a loading spinner while checking authentication status
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
        );
    }

    return (
        <div className='min-h-dvh h-full bg-gray-200 '>
            로그인을 다시 시도하세요.
        </div>
    );
};

export default AdminMain;

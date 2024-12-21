'use client';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useAppDispatch } from '@/lib/hooks';
import { updateUser } from '@/lib/slices/userSlice';
import { useQuery } from '@tanstack/react-query';
import * as UserServices from '@/service/UserServices';

const dotenv = require('dotenv');
dotenv.config();
const AccountPage = () => {
    const userSelector = useAppSelector((state) => state.user);
    const [isClient, setIsClient] = useState(false);
    const [isChangingName, setIsChangingName] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const checkTokenExpiry = async () => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await UserServices.checkToken(access_token);
            return res;
        } else {
            return false;
        }
    };

    const { data: isTokenUsable } = useQuery({
        queryKey: ['checkTokenExpired'],
        queryFn: checkTokenExpiry,
        retry: 1,
        enabled: true
    });

    useEffect(() => {
        if (isTokenUsable == false && isTokenUsable != undefined) {
            dispatch(
                updateUser({
                    _id: '',
                    name: ''
                })
            );
            localStorage.removeItem('access_token');
            redirect('/login');
        }
    }, [isTokenUsable]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    var handleTurnOnChangingName = () => {
        setIsChangingName(true);
    };
    var handleTurnOffChangingName = () => {
        setIsChangingName(false);
    };
    return (
        <div className="w-full h-full bg-indigo-500 flex flex-col items-center">
            <div className="bg-indigo-400 w-1/2 h-1/2 rounded mb-2 flex flex-col items-center justify-center lg:w-full">
                {/* {isChangingName == false ? (
                    <div className="text-3xl text-white">
                        {isClient ? userSelector?.name : 'Loading...'}
                    </div>
                ) : (
                    <div className="w-1/2">
                        <input className="w-full" placeholder="Tên"></input>
                        <div className="flex">
                            <button
                                onClick={handleTurnOffChangingName}
                                className="w-1/2 h-fit mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Xác nhận
                            </button>
                            <button
                                onClick={handleTurnOffChangingName}
                                className="w-1/2 h-fit mt-2 ml-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Hủy
                            </button>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleTurnOnChangingName}
                    className="w-1/2 h-fit mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Đổi tên
                </button> */}
                <div className="text-3xl text-white">
                    Tên người dùng:{' '}
                    {isClient ? userSelector?.name : 'Loading...'}
                </div>
            </div>

            <button
                onClick={() => {
                    localStorage.removeItem('access_token');
                    dispatch(
                        updateUser({
                            _id: '',
                            name: ''
                        })
                    );
                    router.push('/login');
                }}
                className="w-1/2 h-fit ml-1 bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button">
                Đăng xuất
            </button>
        </div>
    );
};

export default AccountPage;

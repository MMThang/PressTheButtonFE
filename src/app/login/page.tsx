'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as UserService from '@/service/UserServices';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { jwtDecode } from 'jwt-decode';
import { getUser } from '@/service/UserServices';
import { updateUser } from '@/lib/slices/userSlice';
import NameComponent from '@/components/NameComponent';
const jwt = require('jsonwebtoken');

export default function Login() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const loginService = async (dataObj: {
        name: string;
        password: string;
    }) => {
        const res = await UserService.loginUser(dataObj.name, dataObj.password);
        return res;
    };

    var login = useMutation({
        mutationFn: loginService
    });

    const handleLogin = (name: string, password: string) => {
        login.mutate({ name, password });
    };

    const handleGetUser = useCallback(
        async (id: string, accessToken: string) => {
            const res = await getUser(id, accessToken);
            dispatch(
                updateUser({
                    _id: res?.id,
                    name: res?.name
                })
            );
        },
        [dispatch]
    );
    useEffect(() => {
        if (login.isSuccess) {
            router.push('/');
            localStorage.setItem('access_token', JSON.stringify(login?.data));
        }
        if (login?.data) {
            const decoded = jwt.decode(login?.data);
            if (decoded.sid) {
                handleGetUser(decoded?.sid, login?.data);
            }
        }
    }, [login.isSuccess]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-indigo-500">
            <div className="flex flex-grow items-center ">
                <NameComponent />
            </div>
            <div className="w-full max-w-xs flex-grow lg:max-w-xl lg:mx-2">
                <div className="text-white font-semibold text-2xl">
                    Đăng nhập
                </div>
                <form className="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 lg:h-modal lg:pb-0">
                    <div>
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username">
                            Tài khoản
                        </label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Tài khoản"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                        />
                    </div>
                    {(login.error?.response.data == 'Wrong password' ||
                        login.error?.response.data ==
                            'User does not exist') && (
                        <div className="mb-4 text-red-500 font-bold">
                            Tài khoản hoặc mật khẩu sai
                        </div>
                    )}
                    <a
                        className="inline-block align-baseline font-bold text-sm text-blue-500 cursor-pointer hover:text-blue-800"
                        onClick={() => {
                            router.push('/register');
                        }}>
                        Chưa có tài khoản?
                    </a>

                    <button
                        onClick={() => handleLogin(name, password)}
                        className="w-full mr-2 mt-2 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded focus:outline-none focus:shadow-outline"
                        type="button">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}

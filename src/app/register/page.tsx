'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as UserService from '@/service/UserServices';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [recheckPassword, setRecheckPassword] = useState('');

    const registerService = async (dataObj: {
        name: string;
        password: string;
        recheckPassword: string;
    }) => {
        const res = await UserService.registerUser(
            dataObj.name,
            dataObj.password,
            dataObj.recheckPassword
        );
        return res;
    };

    var register = useMutation({
        mutationFn: registerService
    });

    useEffect(() => {
        if (register.isSuccess) {
            router.push('/login');
        }
    }, [register.isSuccess]);

    const handleRegister = (name: string, password: string) => {
        register.mutate({ name, password, recheckPassword });
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-indigo-500">
            <div className="flex flex-grow items-center ">
                <p className="text-3xl uppercase italic underline text-white decoration-solid decoration-white">
                    Ấn nút hay chạy mất hút
                </p>
            </div>
            <div className="w-full max-w-xs flex-grow lg:max-w-xl lg:mx-2">
                <div className="text-white font-semibold text-2xl">Đăng kí</div>
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
                    {register.error?.response.data ==
                        'Account minimum 6 characters' && (
                        <div className="mb-4 text-red-500 font-bold">
                            Tối thiểu 6 kí tự
                        </div>
                    )}
                    <div className="mt-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="******************"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            onChange={(e) => setRecheckPassword(e.target.value)}
                            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="recheckpassword"
                            type="password"
                            placeholder="******************"
                        />
                    </div>
                    {register.error?.response.data ==
                        'Password minimum 6 characters' && (
                        <div className="mb-4 text-red-500 font-bold">
                            Tối thiểu 6 kí tự
                        </div>
                    )}
                    <a
                        className="mt-4 inline-block align-baseline font-bold text-sm text-blue-500 cursor-pointer hover:text-blue-800"
                        onClick={() => {
                            router.push('/login');
                        }}>
                        Đã có tài khoản?
                    </a>
                    <div className="w-full mt-3 flex items-center justify-between">
                        <button
                            onClick={() => handleRegister(name, password)}
                            className="w-full mr-2 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded focus:outline-none focus:shadow-outline"
                            type="button">
                            Đăng kí
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

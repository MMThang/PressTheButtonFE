'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import * as UserServices from '@/service/UserServices';
import * as ScenarioService from '@/service/ScenarioService';
import { updateUser } from '@/lib/slices/userSlice';

const CreatePage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userSelector = useAppSelector((state) => state.user);
    const [goodOutcome, setGoodOutcome] = useState('');
    const [badOutcome, setBadOutcome] = useState('');

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

    const createScenario = async ({
        userId,
        good,
        bad
    }: {
        userId: string;
        good: string;
        bad: string;
    }) => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await ScenarioService.createScenario(
                access_token,
                userId,
                good,
                bad
            );
            return res;
        } else {
            return false;
        }
    };

    const createScenarioMutation = useMutation({ mutationFn: createScenario });

    const handleCreateScenarioButton = () => {
        createScenarioMutation.mutate({
            userId: userSelector._id,
            good: goodOutcome,
            bad: badOutcome
        });
    };

    const { data: isTokenUsable } = useQuery({
        queryKey: ['checkTokenExpiredInScenarioPage'],
        queryFn: checkTokenExpiry,
        retry: 1,
        enabled: true
    });
    useEffect(() => {
        if (isTokenUsable == false && isTokenUsable != undefined) {
            localStorage.removeItem('access_token');
            dispatch(
                updateUser({
                    _id: '',
                    name: ''
                })
            );
            redirect('/login');
        }
    }, [isTokenUsable]);

    return (
        <div className="w-full h-full bg-indigo-500 flex justify-center">
            <div className="w-1/2 h-full flex flex-col items-center justify-start md:w-full">
                <div className="mt-2 m-[-1px] flex z-10">
                    <div
                        className="text-2xl px-4 py-2 rounded-t  text-white cursor-pointer hover:bg-white hover:text-indigo-500 lg:text-sm"
                        onClick={() =>
                            router.push('/scenarios/favorite?page=1')
                        }>
                        Thích
                    </div>
                    <div
                        className="text-2xl px-4 py-2 rounded-t  text-white cursor-pointer hover:bg-white hover:text-indigo-500 lg:text-sm"
                        onClick={() => router.push('/scenarios/history')}>
                        Lịch sử
                    </div>
                    <div
                        className="text-2xl px-4 py-2 rounded-t  text-white cursor-pointer hover:bg-white hover:text-indigo-500 lg:text-sm"
                        onClick={() => router.push('/scenarios/yours?page=1')}>
                        Đã tạo
                    </div>
                    <div className="text-2xl px-4 py-2 rounded-t bg-indigo-400 text-white border-x border-t border-b border-b-indigo-400 cursor-pointer lg:text-sm">
                        Tạo mới
                    </div>
                </div>
                <div className="w-full h-full bg-indigo-400 border border-white flex flex-col items-center justify-center lg:justify-start lg:py-2">
                    <span className="text-5xl text-white font-bold p-3 mb-5 border-2 rounded-2xl lg:text-2xl">
                        Tạo 1 tình huống
                    </span>
                    <div className="w-full mb-5 flex flex-col items-center text-white">
                        <span className="text-4xl lg:text-2xl">LUẬT</span>
                        <ul
                            data-style={'list-style-type:circle'}
                            className="text-2xl lg:text-xl">
                            <li>- Tạo một tình huống thú vị.</li>
                            <li>- Không xúc phạm người khác.</li>
                            <li>- Không chính trị, tôn giáo.</li>
                            <li>- Không đăng thông tin cá nhân.</li>
                            <li>- Không spam, quảng cáo.</li>
                        </ul>
                    </div>
                    <form className="w-full flex flex-col">
                        <div className="mb-2 w-11/12 mx-auto">
                            <textarea
                                placeholder="Mặt tốt"
                                className="w-full"
                                onChange={(e) => {
                                    setGoodOutcome(e.target.value);
                                }}
                            />
                        </div>
                        <span className="text-center text-2xl w-full text-white">
                            nhưng
                        </span>
                        <div className="mt-3 mb-5 w-11/12 mx-auto">
                            <textarea
                                placeholder="Mặt xấu"
                                className="w-full"
                                onChange={(e) => {
                                    setBadOutcome(e.target.value);
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            onClick={() => {
                                handleCreateScenarioButton();
                            }}
                            className="w-11/12 mx-auto bg-indigo-700 text-white rounded p-1">
                            Tạo
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;

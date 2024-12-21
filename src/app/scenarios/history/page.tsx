'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import * as UserServices from '@/service/UserServices';
import { updateUser } from '@/lib/slices/userSlice';
import { getScenarioByCategory } from '@/service/ScenarioService';
import ScenarioPageComponent from '@/components/ScenarioPageComponent';

const HistoryPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userSelector = useAppSelector((state) => state.user);

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

    const getHistoryScenario = async () => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await getScenarioByCategory(
                access_token,
                userSelector._id,
                'history',
                1
            );
            return res;
        } else {
            return false;
        }
    };
    const { data: scenarioData, refetch: refetchData } = useQuery({
        queryKey: ['HistoryScenario'],
        queryFn: getHistoryScenario,
        retry: 3,
        enabled: true
    });

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
                    <div className="text-2xl px-4 py-2 rounded-t bg-indigo-400 text-white border-x border-t border-b border-b-indigo-400 cursor-pointer lg:text-sm">
                        Lịch sử
                    </div>
                    <div
                        className="text-2xl px-4 py-2 rounded-t  text-white cursor-pointer hover:bg-white hover:text-indigo-500 lg:text-sm"
                        onClick={() => router.push('/scenarios/yours?page=1')}>
                        Đã tạo
                    </div>
                    <div
                        className="text-2xl px-4 py-2 rounded-t  text-white cursor-pointer hover:bg-white hover:text-indigo-500 lg:text-sm"
                        onClick={() => router.push('/scenarios/create')}>
                        Tạo mới
                    </div>
                </div>
                {/* <div className="w-full h-full bg-white">
                    {scenarioData != false ? (
                        scenarioData?.item2 != false ? (
                            scenarioData?.item2
                                ?.toReversed()
                                .map((scenario: any, index: number) => (
                                    <div key={index}>
                                        <div className="flex items-center mx-1 border-b-2">
                                            <span className="text-gray-500">
                                                {index + 1}
                                            </span>

                                            <div
                                                className="w-full flex justify-center py-2 cursor-pointer"
                                                onClick={() => {
                                                    router.push(
                                                        `/${scenario.id}`
                                                    );
                                                }}>
                                                <span className="text-green-500">
                                                    {scenario.goodOutcome}
                                                </span>
                                                <span className="mx-1">
                                                    nhưng
                                                </span>
                                                <span className="text-red-500">
                                                    {scenario.badOutcome}
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="h-full flex justify-center items-center text-2xl text-gray-500">
                                Danh sách trống
                            </div>
                        )
                    ) : (
                        'Loading'
                    )}
                </div> */}
                <ScenarioPageComponent
                    scenarioData={scenarioData}
                    pageCategory="history"
                    refetchData={null}
                />
            </div>
        </div>
    );
};

export default HistoryPage;

'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import * as UserServices from '@/service/UserServices';
import { updateUser } from '@/lib/slices/userSlice';
import { getScenarioByCategory } from '@/service/ScenarioService';
import PaginationComponent from '@/components/PaginationComponent';
import { useQueryParams, NumberParam } from 'use-query-params';
import ScenarioPageComponent from '@/components/ScenarioPageComponent';

const FavoritePage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const userSelector = useAppSelector((state) => state.user);

    const [query, setQuery] = useQueryParams({
        page: NumberParam
    });

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

    const getFavoriteScenario = async () => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await getScenarioByCategory(
                access_token,
                userSelector._id,
                'favorite',
                query.page || 1
            );
            return res;
        } else {
            return false;
        }
    };

    const { data: isTokenUsable } = useQuery({
        queryKey: ['checkTokenExpiredInScenarioPage'],
        queryFn: checkTokenExpiry,
        retry: 1,
        enabled: true
    });

    const { data: scenarioData, refetch: refetchData } = useQuery({
        queryKey: ['FavoriteScenario', query],
        queryFn: getFavoriteScenario,
        retry: 3,
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
                    <div className="text-2xl px-4 py-2 rounded-t bg-indigo-400 text-white border-x border-t border-b border-b-indigo-400 cursor-pointer lg:text-sm">
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
                    <div
                        className="text-2xl px-4 py-2 rounded-t  text-white cursor-pointer hover:bg-white hover:text-indigo-500 lg:text-sm"
                        onClick={() => router.push('/scenarios/create')}>
                        Tạo mới
                    </div>
                </div>
                <ScenarioPageComponent
                    scenarioData={scenarioData}
                    pageCategory="favorite"
                    refetchData={refetchData}
                />
                {scenarioData?.item2 != false && (
                    <PaginationComponent totalPage={scenarioData?.item1} />
                )}
            </div>
        </div>
    );
};

export default FavoritePage;

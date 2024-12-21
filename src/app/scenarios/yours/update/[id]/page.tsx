'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import * as UserServices from '@/service/UserServices';
import * as ScenarioService from '@/service/ScenarioService';
import { updateUser } from '@/lib/slices/userSlice';

const UpdatePage = ({ params }: { params: { id: number } }) => {
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

    const fetchScenario = async () => {
        const res = await ScenarioService.getScenario(params.id);
        return res;
    };

    const updateScenario = async ({
        scenarioId,
        goodOutcome,
        badOutcome
    }: {
        scenarioId: number;
        goodOutcome: string;
        badOutcome: string;
    }) => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await ScenarioService.updateScenario(
                access_token,
                scenarioId,
                goodOutcome,
                badOutcome
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

    const {
        data: scenario,
        isSuccess: isSuccessScenario,
        isLoading: isLoadingScenario
    } = useQuery({
        queryKey: ['getScenarioForUpdate'],
        queryFn: fetchScenario,
        retry: 3,
        enabled: true
    });

    const updateScenarioMutation = useMutation({
        mutationFn: updateScenario,
        onSuccess: () => {
            alert('Cập nhật thành công');
        },
        onError: () => {
            alert('Cập nhật thất bại');
        }
    });

    const handleResetButton = () => {
        setGoodOutcome(scenario?.goodOutcome);
        setBadOutcome(scenario?.badOutcome);
    };

    const handleUpdateButton = () => {
        updateScenarioMutation.mutate({
            scenarioId: params.id,
            goodOutcome,
            badOutcome
        });
    };

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
    useEffect(() => {
        if (isSuccessScenario) {
            setGoodOutcome(scenario?.goodOutcome);
            setBadOutcome(scenario?.badOutcome);
        }
    }, [isSuccessScenario]);

    return (
        <div className="w-full h-full bg-indigo-500 flex justify-center">
            <div className="w-full h-full flex flex-col items-center justify-start">
                <div className="mt-2 m-[-1px] flex z-10">
                    <div
                        className="text-2xl px-4 py-2 rounded-t  text-white cursor-pointer hover:bg-white hover:text-indigo-500 lg:text-sm"
                        onClick={() => router.push('/scenarios/yours?page=1')}>
                        Quay lại
                    </div>
                    <div className="text-2xl px-4 py-2 rounded-t bg-indigo-400 text-white border-x border-t border-b border-b-indigo-400 cursor-pointer lg:text-sm">
                        Cập nhật
                    </div>
                </div>
                <div className="w-1/2 h-full bg-indigo-400 border border-white flex flex-col items-center justify-center lg:w-full">
                    <span className="text-5xl font-bold mb-5 p-3 text-white border-2 rounded-2xl lg:text-2xl">
                        Cập nhật tình huống
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
                    <form className="w-full flex flex-col items-center">
                        <div className="mb-2 w-11/12 mx-auto">
                            <textarea
                                placeholder={
                                    isLoadingScenario ? 'Loading...' : 'Mặt tốt'
                                }
                                className="w-full"
                                onChange={(e) => {
                                    setGoodOutcome(e.target.value);
                                }}
                                defaultValue={goodOutcome}
                                spellCheck={false}
                            />
                        </div>
                        <span className="text-center text-2xl w-full text-white">
                            nhưng
                        </span>
                        <div className="mt-3 mb-5 w-11/12 mx-auto">
                            <textarea
                                placeholder={
                                    isLoadingScenario ? 'Loading...' : 'Mặt xấu'
                                }
                                className="w-full"
                                onChange={(e) => {
                                    setBadOutcome(e.target.value);
                                }}
                                defaultValue={badOutcome}
                                spellCheck={false}
                            />
                        </div>
                        <div className="w-11/12 flex gap-2">
                            <button
                                type="submit"
                                onClick={() => {
                                    handleResetButton();
                                }}
                                className="w-1/2 h-fit p-1 bg-white text-indigo-600 rounded">
                                Reset
                            </button>
                            <button
                                type="submit"
                                onClick={() => {
                                    handleUpdateButton();
                                }}
                                className="w-1/2 h-fit p-1 bg-indigo-700 text-white rounded">
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePage;

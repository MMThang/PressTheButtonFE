'use client';
import { useRouter } from 'next/navigation';
import * as UserServices from '@/service/UserServices';
import * as ScenarioService from '@/service/ScenarioService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '@/lib/hooks';
import { NumberParam, useQueryParams } from 'use-query-params';
import { gearIcon, trashIcon } from '../../public/icons/icons';
import { useState } from 'react';

function ScenarioPageComponent({
    scenarioData,
    pageCategory,
    refetchData
}: {
    scenarioData: any;
    pageCategory: string;
    refetchData: any | null;
}) {
    const router = useRouter();
    const userSelector = useAppSelector((state) => state.user);
    const queryClient = useQueryClient();
    const [query, setQuery] = useQueryParams({
        page: NumberParam
    });
    const [isDelete, setIsDelete] = useState(false);
    const [deleteScenarioId, setDeleteScenarioId] = useState(0);
    const removeScenarioLike = async (scenarioId: number) => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await UserServices.deleteScenarioLike(
                access_token,
                userSelector._id,
                scenarioId
            );
            return res;
        } else {
            return false;
        }
    };

    const deleteScenario = async (scenarioId: number) => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await ScenarioService.deleteScenario(
                access_token,
                scenarioId
            );
            return res;
        } else {
            return false;
        }
    };

    var handleRemoveLikeScenario = useMutation({
        mutationFn: removeScenarioLike,
        onSuccess: () => {
            queryClient.setQueryData(['FavoriteScenario', query], refetchData);
        }
    });
    var handleDeleteScenario = useMutation({
        mutationFn: deleteScenario,
        onSuccess: () => {
            queryClient.setQueryData(['YourScenario', query], refetchData);
            setIsDelete(false);
        }
    });

    var handleUpdatePageButton = (scenarioId: number) => {
        router.push(`/scenarios/yours/update/${scenarioId}`);
    };
    var handleDeleteLikeButton = (scenarioId: number) => {
        handleRemoveLikeScenario.mutateAsync(scenarioId);
    };
    var handleDeleteBox = (scenarioId: number) => {
        setIsDelete(true);
        setDeleteScenarioId(scenarioId);
    };
    var handleDeleteButton = (scenarioId: number) => {
        handleDeleteScenario.mutateAsync(scenarioId);
    };
    return (
        <div className="w-full h-full bg-indigo-400 border border-white sm:overflow-auto relative">
            {isDelete == true && (
                <div className="flex justify-center">
                    <div
                        className="w-full h-full absolute bg-black opacity-65 flex items-center justify-center"
                        onClick={() => {
                            setIsDelete(false);
                        }}></div>
                    <div className="w-2/4 py-2 absolute flex flex-col items-center justify-center top-1/2 bg-indigo-400 border-2 border-white rounded-sm z-20 lg:w-4/5">
                        <p className="text-white mb-2">
                            Bạn có muốn xóa tình huống này?
                        </p>
                        <div className="w-full flex justify-center gap-2">
                            <button
                                className="w-1/4 h-fit p-2 bg-red-500 text-white"
                                onClick={() => {
                                    handleDeleteButton(deleteScenarioId);
                                }}>
                                Xóa
                            </button>
                            <button
                                className="w-1/4 h-fit p-2 bg-indigo-500 text-white"
                                onClick={() => {
                                    setIsDelete(false);
                                }}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {scenarioData != false ? (
                scenarioData?.item2 != false ? (
                    scenarioData?.item2
                        ?.toReversed()
                        .map((scenario: any, index: number) => (
                            <div key={index}>
                                <div className="p-2 m-2 flex items-center mx-1 border-b-2 bg-white ">
                                    <span className="text-gray-500">
                                        {index + 1}
                                    </span>

                                    <div
                                        className="w-full justify-center py-2 mx-3 cursor-pointer"
                                        onClick={() => {
                                            router.push(`/${scenario.id}`);
                                        }}>
                                        <span className="text-green-500">
                                            {scenario.goodOutcome}
                                        </span>
                                        <span className="mx-1">nhưng</span>
                                        <span className="text-red-500">
                                            {scenario.badOutcome}
                                        </span>
                                    </div>
                                    {pageCategory == 'favorite' && (
                                        <button
                                            onClick={() =>
                                                handleDeleteLikeButton(
                                                    scenario.id
                                                )
                                            }
                                            type="button"
                                            className="w-6">
                                            <span>{trashIcon}</span>
                                        </button>
                                    )}
                                    {pageCategory == 'yours' && (
                                        <div className="flex">
                                            <button
                                                onClick={() =>
                                                    handleUpdatePageButton(
                                                        scenario.id
                                                    )
                                                }
                                                type="button"
                                                className="w-6">
                                                <span>{gearIcon}</span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteBox(scenario.id)
                                                }
                                                type="button"
                                                className="w-6 text-red-500">
                                                <span>{trashIcon}</span>
                                            </button>
                                        </div>
                                    )}
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
        </div>
    );
}

export default ScenarioPageComponent;

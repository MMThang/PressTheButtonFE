'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as ScenarioService from '@/service/ScenarioService';
import * as UserServices from '@/service/UserServices';
import { redirect, useRouter } from 'next/navigation';
import {
    arrowRightIcon,
    checkIcon,
    heartIcon
} from '../../../../public/icons/icons';
import { Chart, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import NameComponent from '@/components/NameComponent';

Chart.register(Tooltip, Legend, ArcElement);

export default function Result({ params }: { params: { id: number } }) {
    const router = useRouter();
    const userSelector = useAppSelector((state) => state.user);
    const [isLike, setIsLike] = useState(false);

    const options = {};

    const fetchScenario = async () => {
        const res = await ScenarioService.getScenario(params.id);
        return res;
    };

    const fetchRandomId = async () => {
        const res = await ScenarioService.getARandomId(params.id);
        return res;
    };

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

    const likeScenario = async () => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await UserServices.likeScenario(
                access_token,
                userSelector._id,
                params.id
            );
            return res;
        } else {
            return false;
        }
    };

    const isScenarioLike = async () => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await UserServices.isScenarioLike(
                access_token,
                userSelector._id,
                params.id
            );
            return res;
        } else {
            return false;
        }
    };

    const deleteScenarioLike = async () => {
        var access_token = localStorage.getItem('access_token') || '';
        if (access_token !== '') {
            access_token = JSON.parse(access_token);
            const res = await UserServices.deleteScenarioLike(
                access_token,
                userSelector._id,
                params.id
            );
            return res;
        } else {
            return false;
        }
    };

    const { data: scenario } = useQuery({
        queryKey: ['getScenario'],
        queryFn: fetchScenario,
        retry: 3,
        enabled: true
    });

    const { data: randomId } = useQuery({
        queryKey: ['getRandomId'],
        queryFn: fetchRandomId,
        retry: 3,
        enabled: true
    });

    const { data: isTokenUsable } = useQuery({
        queryKey: ['checkTokenExpiredInLikeButton'],
        queryFn: checkTokenExpiry,
        retry: 1,
        enabled: true
    });

    var handleLikeScenario = useMutation({
        mutationFn: likeScenario,

        onSuccess: () => {
            setIsLike(true);
        }
    });

    const { data: isAlreadyLike } = useQuery({
        queryKey: ['isScenarioLike'],
        queryFn: isScenarioLike,
        retry: 3,
        enabled: true
    });

    useEffect(() => {
        setIsLike(isAlreadyLike);
    }, [isAlreadyLike]);

    var handleDeleteLikeScenario = useMutation({
        mutationFn: deleteScenarioLike,

        onSuccess: () => {
            setIsLike(false);
        }
    });

    const handleLiking = () => {
        if (isTokenUsable == false && isTokenUsable != undefined) {
            return false;
        } else {
            handleLikeScenario.mutate();
            return true;
        }
    };

    const handleRemoveLiking = () => {
        if (isTokenUsable == false && isTokenUsable != undefined) {
            return false;
        } else {
            handleDeleteLikeScenario.mutate();
            return true;
        }
    };

    var scenarioPressedCount = scenario?.pressedCount;
    var scenarioDeniedCount = scenario?.deniedCount;
    const handleFetchScenario = () => {
        router.push(`/${randomId}`);
    };

    const doughnutChartData = {
        labels: ['Không ấn nút', 'Án nút'],
        datasets: [
            {
                labels: 'so luong',
                data: [scenarioDeniedCount, scenarioPressedCount],
                backgroundColor: [
                    'rgba(220, 38, 38, 1)', //red
                    'rgba(22, 163, 74, 1)' //green
                ],
                hoverOffset: 4
            }
        ]
    };

    return (
        <div className="w-full h-full flex flex-col items-center bg-indigo-500">
            <div className="mt-4">
                <NameComponent />
            </div>
            <div className="w-2/3 h-fit p-2 mt-11 border-2 bg-green-900 border-green-300 text-white rounded text-lg text-center break-words lg:w-full ">
                {scenario?.goodOutcome}
            </div>
            <div className="mt-2 text-lg bg-indigo-500 text-white font-bold italic flex items-center justify-center">
                NHƯNG
            </div>
            <div className="w-2/3 h-fit p-2 mt-2 border-2 bg-red-900 border-red-300 text-white rounded text-lg text-center break-words lg:w-full">
                {scenario?.badOutcome}
            </div>
            <div className="flex">
                <button
                    className="w-20 text-center bg-indigo-400 mt-2 p-2 border-2 border-white rounded transition-all group hover:bg-white"
                    onClick={handleFetchScenario}>
                    <span className="text-white transition-all group-hover:text-indigo-600">
                        {arrowRightIcon}
                    </span>
                </button>
                {isLike == true ? (
                    <button
                        className="w-20 ml-2 text-center bg-white mt-2 p-2 border-2 border-pink-500 rounded transition-all group hover:bg-pink-500"
                        onClick={handleRemoveLiking}>
                        <span className="text-pink-600 transition-all group-hover:text-pink-300">
                            {checkIcon}
                        </span>
                    </button>
                ) : (
                    <button
                        className="w-20 ml-2 text-center bg-pink-500 mt-2 p-2 border-2 border-white rounded transition-all group hover:bg-white"
                        onClick={handleLiking}>
                        <span className="text-pink-300 transition-all group-hover:text-pink-600">
                            {heartIcon}
                        </span>
                    </button>
                )}
            </div>
            <div className="w-fit h-fit mt-2 p-2 bg-indigo-400 border-2 border-white rounded text-2xl lg:text-lg">
                <div className="text-white">
                    Số người chơi:{' '}
                    <span className="font-bold">
                        {scenarioPressedCount + scenarioDeniedCount}
                    </span>
                </div>
                <div>
                    <span className="text-white">Số người chơi ấn nút:</span>{' '}
                    <span className="text-green-800 font-bold">
                        {scenarioPressedCount} (
                        {(
                            (scenarioPressedCount /
                                (scenarioPressedCount + scenarioDeniedCount)) *
                            100
                        ).toFixed(1)}
                        %)
                    </span>
                </div>
                <div>
                    <span className="text-white">
                        Số người chơi từ chối ấn nút:
                    </span>{' '}
                    <span className="text-red-800 font-bold">
                        {scenarioDeniedCount} (
                        {(
                            (scenarioDeniedCount /
                                (scenarioPressedCount + scenarioDeniedCount)) *
                            100
                        ).toFixed(1)}
                        %)
                    </span>
                </div>
            </div>
            <div className="w-80 h-80">
                <Pie options={options} data={doughnutChartData} />
            </div>
        </div>
    );
}

'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as ScenarioService from '@/service/ScenarioService';
import * as UserService from '@/service/UserServices';
import { useRouter } from 'next/navigation';
import YEA from '../../../public/YEA.png';
import NAY from '../../../public/NAY.png';
import { useSelector } from 'react-redux';

export default function Home({ params }: { params: { id: number } }) {
    const router = useRouter();
    const userSelector = useSelector((state: any) => state.user);

    const fetchScenario = async () => {
        const res = await ScenarioService.getScenario(params.id || 3);
        return res;
    };

    const updatePlayedCountScenario = async (dataObj: {
        id: number;
        isPressed: boolean;
    }) => {
        const res = await ScenarioService.updatePlayedCount(
            dataObj.id,
            dataObj.isPressed
        );
        return res;
    };

    const historyScenario = async (dataObj: {
        access_token: string;
        userId: string;
        scenarioId: number;
    }) => {
        const res = await UserService.historyScenario(
            dataObj.access_token,
            dataObj.userId,
            dataObj.scenarioId
        );
        return res;
    };

    const {
        data: scenario,
        isLoading: isLoadingScenario,
        isError: isErrorScenario
    } = useQuery({
        queryKey: ['getScenario'],
        queryFn: fetchScenario,
        retry: 3,
        enabled: true
    });
    var mutationPlayedCount = useMutation({
        mutationFn: updatePlayedCountScenario
    });

    var historyScenarioMutation = useMutation({
        mutationFn: historyScenario
    });

    const handleUpdatePlayedCount = (id: number, isPressed: boolean) => {
        mutationPlayedCount.mutate({
            id,
            isPressed
        });

        var access_token = localStorage.getItem('access_token') || '';
        if (access_token != '') {
            access_token = JSON.parse(access_token);
            historyScenarioMutation.mutate({
                access_token,
                userId: userSelector._id,
                scenarioId: params.id
            });
        }

        router.push(`result/${params.id}`);
    };

    return (
        // <div className="w-full h-full bg-white flex flex-col items-center justify-center lg:justify-start">
        //     <div
        //         className="bg-repeat bg-contain group h-5/6 w-full flex items-center justify-center transition-all hover:opacity-85 cursor-pointer"
        //         style={{
        //             backgroundImage: `url(${YES.src})`
        //         }}
        //         onClick={() => {
        //             handleUpdatePlayedCount(params.id, true);
        //         }}>
        //         <p className="w-5/6 h-fit p-2 border-2 bg-green-900  border-green-300 rounded text-white text-2xl text-center break-words transition-all group-hover:bg-green-300 group-hover:border-green-800 group-hover:text-green-950 group-hover:font-bold group-hover:-translate-y-1 group-hover:scale-110">
        //             {scenario?.goodOutcome || isErrorScenario}
        //         </p>
        //     </div>
        //     <div className="w-full h-1/10 text-lg bg-indigo-500 text-white border-y-8 border-t-green-900 border-b-red-900 font-bold italic flex items-center justify-center">
        //         NHƯNG
        //     </div>
        //     <div
        //         className="bg-repeat bg-contain group h-5/6 w-full flex items-center justify-center transition-all hover:opacity-85 cursor-pointer"
        //         style={{
        //             backgroundImage: `url(${NO.src})`
        //         }}
        //         onClick={() => {
        //             handleUpdatePlayedCount(params.id, false);
        //         }}>
        //         <p className="w-5/6 h-fit p-2 border-2 bg-red-900 border-red-300 rounded text-white text-2xl text-center break-words transition-all group-hover:bg-red-300 group-hover:border-red-800 group-hover:text-red-950 group-hover:font-bold group-hover:-translate-y-1 group-hover:scale-110">
        //             {scenario?.badOutcome || isErrorScenario}
        //         </p>
        //     </div>
        // </div>

        <div className="w-full h-full bg-white flex flex-col">
            <div className="w-full h-5/6 flex flex-col">
                <div
                    className="flex-grow bg-repeat bg-contain group  w-full border-y-8 border-green-800 flex items-center justify-center transition-all"
                    style={{
                        backgroundImage: `url(${YEA.src})`
                    }}>
                    <p className="w-5/6  p-2 border-2 bg-green-900   border-green-300 rounded text-white text-3xl text-center break-words transition-all ">
                        {scenario?.goodOutcome || isErrorScenario}
                    </p>
                </div>
                <div className="w-full py-1 flex-grow-0 text-2xl bg-indigo-500 text-white font-bold italic flex items-center justify-center">
                    NHƯNG
                </div>
                <div
                    className="flex-grow bg-repeat bg-contain group  w-full border-y-8 border-red-900 flex items-center justify-center transition-all"
                    style={{
                        backgroundImage: `url(${NAY.src})`
                    }}>
                    <p className="w-5/6  p-2 border-2 bg-red-900 border-red-300 rounded text-white text-3xl text-center break-words  ">
                        {scenario?.badOutcome || isErrorScenario}
                    </p>
                </div>
            </div>
            <div className="w-full h-1/6 p-2 bg-indigo-500 flex items-center justify-center gap-4 lg:justify-normal ">
                <button
                    className="w-1/4 h-1/2 p-1 uppercase text-2xl bg-purple-600 text-white border-4 border-purple-700 rounded-xl cursor-pointer transition-all hover:bg-purple-300 hover:border-purple-800 hover:text-purple-950 hover:font-bold hover:-translate-y-1 hover:scale-105 lg:w-1/2 lg:text-base"
                    onClick={() => {
                        handleUpdatePlayedCount(params.id, true);
                    }}>
                    Chấp nhận
                </button>

                <button
                    className="w-1/4 h-1/2 p-1 uppercase text-2xl bg-red-600 text-white border-4 border-red-800 rounded-xl cursor-pointer transition-all hover:bg-red-300 hover:border-red-800 hover:text-red-950 hover:font-bold hover:-translate-y-1 hover:scale-105 lg:w-1/2 lg:text-base"
                    onClick={() => {
                        handleUpdatePlayedCount(params.id, false);
                    }}>
                    Từ chối
                </button>
            </div>
        </div>
    );
}

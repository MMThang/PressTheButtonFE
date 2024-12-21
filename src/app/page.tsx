'use client';
import * as ScenarioService from '@/service/ScenarioService';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
const jwt = require('jsonwebtoken');

export default function Home() {
    const fetchRandomIdForNavigate = async () => {
        const res = await ScenarioService.getARandomId(1);
        return res;
    };
    const { data: randomId, isLoading: loading } = useQuery({
        queryKey: ['getRandomIdForNavigation'],
        queryFn: fetchRandomIdForNavigate,
        retry: 3,
        enabled: true
    });
    useEffect(() => {
        if (randomId) {
            redirect(`/${randomId}`);
        }
    }, [randomId]);

    return <div className="w-full h-full bg-indigo-500"></div>;
}

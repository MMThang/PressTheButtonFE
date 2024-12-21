import type { AppProps } from 'next/app';
import { updateUser } from '@/lib/slices/userSlice';
import { getUser } from '@/service/UserServices';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
const jwt = require('jsonwebtoken');

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

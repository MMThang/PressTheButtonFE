'use client';

import { QueryParamProvider } from 'use-query-params';
import NextAdapterApp from 'next-query-params/app';

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryParamProvider adapter={NextAdapterApp}>
            {children}
        </QueryParamProvider>
    );
}

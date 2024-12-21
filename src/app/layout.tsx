import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/utils/ReactQueryProvider';
import { QueryParamProvider } from 'use-query-params';
import NextAdapterApp from 'next-query-params/app';
import HeaderComponent from '@/components/HeaderComponent';
import StoreProvider from './StoreProvide';
import UseQueryParam from './UseQueryParam';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Ấn nút',
    description: 'Tiều đề'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ReactQueryProvider>
                    <StoreProvider>
                        <UseQueryParam>
                            <div className="h-screen w-screen flex items-center flex-col ">
                                <HeaderComponent />
                                {children}
                            </div>
                        </UseQueryParam>
                    </StoreProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}

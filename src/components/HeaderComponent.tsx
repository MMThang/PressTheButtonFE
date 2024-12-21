import Link from 'next/link';
import { accountIcon, homeIcon, listIcon } from '../../public/icons/icons';

function HeaderComponent() {
    return (
        <div className="flex justify-center h-1/20 w-full bg-indigo-600 lg:h-fit">
            {/* <div
                className="flex h-full w-24 text-center items-center justify-center text-white hover:bg-indigo-800 cursor-pointer lg:h-fit lg:py-1"
                onClick={() => router.push(`/`)}>
                <span className="w-1/2">{homeIcon}</span>
            </div> */}
            <Link
                href={'/'}
                className="flex h-full w-24 text-center items-center justify-center text-white hover:bg-indigo-800 cursor-pointer lg:h-fit lg:py-1">
                <span className="w-1/2">{homeIcon}</span>
            </Link>
            {/* <div
                className="flex h-full w-24 text-center items-center justify-center text-white hover:bg-indigo-800 cursor-pointer lg:h-fit lg:py-1"
                onClick={() => router.push('/scenarios/favorite?page=1')}>
                <span className="w-1/2">{listIcon}</span>
            </div> */}
            <Link
                href={'/scenarios/favorite?page=1'}
                className="flex h-full w-24 text-center items-center justify-center text-white hover:bg-indigo-800 cursor-pointer lg:h-fit lg:py-1">
                <span className="w-1/2">{listIcon}</span>
            </Link>
            {/* <div
                className="flex h-full w-24 text-center items-center justify-center text-white hover:bg-indigo-800 cursor-pointer lg:h-fit lg:py-1"
                onClick={() => router.push('/account')}>
                <span className="w-1/2">{accountIcon}</span>
            </div> */}
            <Link
                href={'/account'}
                className="flex h-full w-24 text-center items-center justify-center text-white hover:bg-indigo-800 cursor-pointer lg:h-fit lg:py-1">
                <span className="w-1/2">{accountIcon}</span>
            </Link>
        </div>
    );
}

export default HeaderComponent;

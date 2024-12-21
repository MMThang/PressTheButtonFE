import { useQueryParam, NumberParam } from 'use-query-params';

function PaginationComponent({ totalPage }: { totalPage: number }) {
    const [page, setPage] = useQueryParam('page', NumberParam);
    let items = [];
    for (let number = 1; number <= totalPage; number++) {
        items.push(
            <li key={number}>
                <a
                    onClick={() => {
                        setPage(number);
                    }}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    {number}
                </a>
            </li>
        );
    }
    const handleNextPage = () => {
        if (page !== totalPage) {
            setPage(page! + 1);
        }
    };
    const handlePrevPage = () => {
        if (page !== 1) {
            setPage(page! - 1);
        }
    };
    return (
        <div className="my-2">
            <nav>
                <ul className="flex items-center -space-x-px h-8 text-sm">
                    <li>
                        <a
                            onClick={handlePrevPage}
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span className="sr-only">Previous</span>
                            <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 1 1 5l4 4"
                                />
                            </svg>
                        </a>
                    </li>
                    {items}
                    <li>
                        <a
                            onClick={handleNextPage}
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span className="sr-only">Next</span>
                            <svg
                                className="w-2.5 h-2.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 9 4-4-4-4"
                                />
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default PaginationComponent;

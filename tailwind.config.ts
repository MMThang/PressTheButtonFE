import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            // backgroundImage: {
            //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            //   "gradient-conic":
            //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            // },
            height: {
                '1/20': '5%',
                '1/10': '10%'
            },
            lineHeight: {
                '100': '100%'
            },
            margin: {
                '-1px': '-1px'
            },
            //destop-first approach
            screens: {
                '2xl': { max: '1535px' }, // => @media (max-width: 1535px) { ... }
                xl: { max: '1279px' }, // => @media (max-width: 1279px) { ... }
                lg: { max: '1024px' }, // => @media (max-width: 1023px) { ... }
                md: { max: '768px' }, // => @media (max-width: 767px) { ... }
                sm: { max: '639px' } // => @media (max-width: 639px) { ... }
            }
        }
    },
    plugins: [require('flowbite/plugin')]
};
export default config;

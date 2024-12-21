const { default: axios } = require('axios');

export const loginUser = async (name: string, password: string) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/User/login`,
        {
            name,
            password
        }
    );
    return res.data;
};

export const registerUser = async (
    name: string,
    password: string,
    recheckPassword: string
) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/User/register`,
        { name, password, recheckPassword }
    );
    return res.data;
};

export const getUser = async (id: string, access_token: string) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/User/account/${id}`,
        {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

export const checkToken = async (access_token: string) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/User/check-token`,
        {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

export const likeScenario = async (
    access_token: string,
    userId: string,
    scenarioId: number
) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/User/like/${userId}`,
        scenarioId,
        {
            headers: {
                Authorization: 'Bearer ' + access_token,
                'Content-Type': 'application/json; charset= utf-8'
            }
        }
    );
    return res.data;
};

export const isScenarioLike = async (
    access_token: string,
    userId: string,
    scenarioId: number
) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/User/isLike/${userId}/${scenarioId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

export const deleteScenarioLike = async (
    access_token: string,
    userId: string,
    scenarioId: number
) => {
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/User/like/${userId}/${scenarioId}`,
        {
            headers: {
                // 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

export const historyScenario = async (
    access_token: string,
    userId: string,
    scenarioId: number
) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/User/history/${userId}`,
        scenarioId,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

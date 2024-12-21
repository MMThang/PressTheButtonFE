const { default: axios } = require('axios');

export const createScenario = async (
    access_token: string,
    userId: string,
    goodOutcome: string,
    badOutcome: string
) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/Scenario/create`,
        { ownerId: userId, goodOutcome, badOutcome },
        {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

export const getScenario = async (id: number) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Scenario/${id}`
    );
    return res.data;
};

export const getARandomId = async (id: number) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Scenario/random/${id}`
    );
    return res.data;
};

export const updatePlayedCount = async (id: number, isPressed: boolean) => {
    const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/Scenario/result`,
        {
            id: id,
            isPressed: isPressed
        }
    );
    return res.data;
};

export const deleteScenario = async (
    access_token: string,
    scenarioId: number
) => {
    const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/Scenario`,
        {
            data: {
                id: scenarioId
            },
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

export const getScenarioByCategory = async (
    access_token: string,
    userId: string,
    category: string,
    page: number
) => {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/Scenario/scenarios/${userId}/${category}?page=${page}`,
        {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

export const updateScenario = async (
    access_token: string,
    scenarioId: number,
    goodOutcome: string,
    badOutcome: string
) => {
    const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/Scenario/`,
        { scenarioId, goodOutcome, badOutcome },
        {
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        }
    );
    return res.data;
};

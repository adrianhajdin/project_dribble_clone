type RequestOptions = {
    method: string;
    body?: any;
};

export const makeRequest = async (url: string, options: RequestOptions) => {
    const { method, body } = options;

    const isProduction = process.env.NODE_ENV === 'production';
    const fullUrl = isProduction ? `${process.env.SERVER_URL}/${url}` || '' : `http://localhost:3000/${url}`;

    console.log({isProduction});
    console.log(fullUrl);
    try {
        const response = await fetch(fullUrl, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            cache: 'no-store'
        });

        return response.json();
    } catch (err) {
        console.log(err)
        return err;
    }
};

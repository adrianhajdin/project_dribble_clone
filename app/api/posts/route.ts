import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";

import { getApiConfig } from "@/lib/utils";
import { getProjectsQuery } from "@/graphql/query";
import { createProjectMutation } from '@/graphql/mutation';

// export async function POST(request: Request) {
//     const { apiUrl, apiKey } = await getApiConfig();
//     const test = await request.json();

//     const { searchParams } = new URL(request.url)
//     const email = searchParams.get('email')

//     console.log({test, email});

//     try {
//         const client = new GraphQLClient(apiUrl, {
//             headers: {
//                 'x-api-key': apiKey,
//             },
//         });

//         const mutation = getProjectsQuery(test.search, test.category, test.cursor);
//         const data = await client.request(mutation);

//         return NextResponse.json(data, { status: 200 });
//     } catch (error) {
//         console.log(error)
//         return NextResponse.json(
//             { message: "Failed to fetch projects" },
//             { status: 500 }
//         );
//     }
// }

export async function POST(request: Request) {
    const {form, creatorId} = await request.json();
    const { apiUrl, apiKey } = await getApiConfig();

    try {
        const client = new GraphQLClient(apiUrl, {
            headers: {
                'x-api-key': apiKey,
            },
        });

        const mutation = createProjectMutation(form, creatorId);
        const data = await client.request(mutation);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Failed to create a project" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { apiUrl, apiKey } = await getApiConfig();
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const cursor = searchParams.get('cursor')
    const search = searchParams.get('search')

    console.log("params", search, category, cursor)

    try {
        const client = new GraphQLClient(apiUrl, {
            headers: {
                'x-api-key': apiKey,
            },
        });

        const mutation = getProjectsQuery(search, category, cursor);
        const data = await client.request(mutation);

        console.log({ data })

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`/api/people`);
    const item = await res.json();

    return { item };
};

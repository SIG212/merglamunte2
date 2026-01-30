/**
 * Example service using native Fetch API
 */
export const exampleService = {
    fetchData: async (id: string) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
};

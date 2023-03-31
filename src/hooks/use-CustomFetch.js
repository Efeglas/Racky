import useToast from '../hooks/use-Toast';

const useCustomFetch = () => {

    const fireToast = useToast();

    const customeFetch = async (path, data, method, afterSuccessCallback, generalEndCallback) => {

        const response = await fetch(`http://192.168.50.62:8080${path}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();
        console.log(json);

        if (response.ok) {
            fireToast(json.message);
            afterSuccessCallback();
        } else {
            fireToast(json.message, 'error');
        }

        generalEndCallback(); 
    }

    return customeFetch;
}

export default useCustomFetch;
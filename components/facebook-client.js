import { v4 } from 'uuid'

export class FacebookClient {

    async findPages(token) {
        const url = 'https://graph.facebook.com/me/accounts'
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'accept': "application/json"
            }
        });
        const json = await response.json()
        console.log('json', json)
        return json.data;
    }




    postMessage = async (pageId, imageUrl, token) => {
        try {
            const message = 'Hello World!'
            const url = `https://graph.facebook.com/v15.0/${pageId}/feed`
            console.log('url', url)
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': "application/json",
                    'accept': "application/json"
                },
                body: JSON.stringify({
                    message,
                    link: imageUrl
                })
            });
            const status = response.status
            console.log('status', status)
            const json = await response.json()
            console.log('json', json)
        } catch (error) {
            console.error(error)
        }
    }

}
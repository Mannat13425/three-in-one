import storage from "@react-native-firebase/storage"
import { v4 } from 'uuid'

export class TwitterClient {

    async postMedia (image, {  oauth_token, oauth_token_secret }, oauth) {
            try {
                if (!image) {
                    return {}
                }
                const token = {
                    key: oauth_token,
                    secret: oauth_token_secret
                };
                const imageUrl = image.uri
                const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
                const authHeader = await oauth.toHeader(oauth.authorize({
                    url: 'https://upload.twitter.com/1.1/media/upload.json',
                    method: 'POST'
                }, token));
                const form = new FormData();
                form.append('media', {
                    uri: imageUrl,
                    type: 'image/jpeg',
                    name: filename,
                });
                const response = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
                    method: 'POST',
                    headers: {
                        Authorization: authHeader["Authorization"],
                        "Content-Type": "multipart/form-data",
                        'accept': "application/json"
                    },
                    body: form
                });
                const status = response.status
                const json = await response.json()
                const mediaId = json['media_id_string']
                return {
                    mediaId,
                    status
                }
            } catch (error) {
                console.error(error)
                return {}
            }
        }

        async postTweet (mediaId, { oauth_token, oauth_token_secret}, oauth) {
            try {

                const token = {
                    key: oauth_token,
                    secret: oauth_token_secret
                };

                const data = {
                    "text": "Hello World!",
                }
                if (mediaId) {
                    data.media = {
                        media_ids: [mediaId]
                    }
                }
                const authHeader = await oauth.toHeader(oauth.authorize({
                    url: 'https://api.twitter.com/2/tweets',
                    method: 'POST',
                }, token));
                const response = await fetch('https://api.twitter.com/2/tweets', {
                    method: 'POST',
                    headers: {
                        Authorization: authHeader["Authorization"],
                        'content-type': "application/json",
                        'accept': "application/json"
                    },
                    body: JSON.stringify(data)
                });
                const status = response.status
                const json = await response.json()
                const body = json.data
                return {
                    body,
                    status
                }
            } catch (error) {
                console.error(error)
                return {}
            }
        }


}
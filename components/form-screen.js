import {useState} from "react";
import * as WebBrowser from 'expo-web-browser';
import {
    Text,
    View,
    Button,
    StatusBar,
    StyleSheet,
    TextInput,
    Image,
    Linking
} from "react-native";
import {PRIMARY_COLOR, QUATERNARY_COLOR} from '../env.json'
import * as ImagePicker from 'expo-image-picker';
import {AccessToken, ShareDialog} from 'react-native-fbsdk-next';
import OAuth from 'oauth-1.0a';
import HmacSHA1 from 'crypto-js/hmac-sha1'
import {FacebookClient, facebookClient} from "./facebook-client";

const CryptoJs = require('crypto-js')
global.Buffer = global.Buffer || require('buffer').Buffer

const qs = require('querystring');

const styles = StyleSheet.create({
    title: {
        color: PRIMARY_COLOR,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: 25,
        marginBottom: 25
    },
    label: {
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
    },
    input: {
        backgroundColor: QUATERNARY_COLOR,
        marginTop: 5,
        marginBottom: 25,
        marginLeft: 15,
        marginRight: 15,
        borderColor: PRIMARY_COLOR,
        borderWidth: 1,
        padding: 5
    },
    spacer: {
        marginBottom: 25
    },
    homeButton: {}

});

// Build up a shareable link.
// const linkExample = {
//   contentType: 'link',
//   contentUrl: "https://facebook.com",
// };

// const photoExample = {
//   contentType: 'photo',
//   photos: [
//     { imageUrl: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif" }
//   ]
// };

const oauth = new OAuth({
    consumer: {
        key: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_API_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => {
        const sha1 = HmacSHA1(baseString, key)
        return CryptoJs.enc.Base64.stringify(sha1)
    }
});

const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';

WebBrowser.maybeCompleteAuthSession();

export const FormScreen = ({navigation}) => {

    const [image, setImage] = useState();

    const [pin, setPin] = useState(false);

    const [twitterPinToken, setTwitterPinToken] = useState('');

    const [twitterMediaAccessToken, setTwitterMediaAccessToken] = useState(null)

    const accessToken = async (oauth_token, verifier) => {
        const authHeader = oauth.toHeader(oauth.authorize({
            url: accessTokenURL,
            method: 'POST'
        }));
        const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
        const req = await fetch(path, {
            method: 'POST',
            headers: {
                Authorization: authHeader["Authorization"]
            }
        });
        const text = await req.text()
        if (text) {
            return qs.parse(text);
        } else {
            throw new Error('Cannot get an OAuth request token');
        }
    }

    const requestToken = async () => {
        const authHeader = oauth.toHeader(oauth.authorize({
            url: requestTokenURL,
            method: 'POST'
        }));

        const req = await fetch(requestTokenURL, {
            method: 'POST',
            headers: {
                Authorization: authHeader["Authorization"]
            }
        });
        const text = await req.text()
        const params = qs.parse(text);
        console.log('params', params)
        authorizeURL.searchParams.append('oauth_token', params.oauth_token);
        console.log('Please go here and authorize:', authorizeURL.href);
        await WebBrowser.openBrowserAsync(authorizeURL.href);
        setTwitterPinToken(params.oauth_token)
    }

    const postMedia = async (image, {  oauth_token, oauth_token_secret }) => {
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

    const postTweet = async (mediaId, { oauth_token, oauth_token_secret }) => {
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

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result);
        }
    };

    const onChangePin = (pin) => {
        setPin(pin)
    }

    const confirmPin = async () => {
        if (pin) {
            const accessTokenResponse = await accessToken(twitterPinToken, pin.trim());
            setTwitterMediaAccessToken(accessTokenResponse)
            setTwitterPinToken('')
            const media = await postMedia(image, accessTokenResponse)
            console.log('media', media)
            const tweet = await postTweet(media.mediaId, accessTokenResponse)
            console.log('tweet', tweet)
        }
    }

    const cancelPin = async () => {
        console.log('cancel pin!')
        setTwitterPinToken('')
    }

    const onShareButtonPress = async () => {
        const shareLinkContent = {
            contentType: 'photo',
            photos: [
                {imageUrl: image}
            ]
        };
        ShareDialog.canShow(shareLinkContent).then((canShow) => {
                console.log("can show", canShow)
                if (canShow) {
                    return ShareDialog.show(shareLinkContent);
                }
            }
        ).then((result) => {
                console.log('result', result)
                if (result.isCancelled) {
                    console.log('Share cancelled');
                } else {
                    console.log('Share success with postId: '
                        + result.postId);
                }
            },
            (error) => {
                console.log('Share fail with error: ' + error);
            }
        );
    }

    const onInstagramShareButtonPress = async () => {
        // let instagramURL = `instagram://library?LocalIdentifier=` + image.uri
        // Linking.openURL(instagramURL);
        const accessToken = (await AccessToken.getCurrentAccessToken()).accessToken
        console.log('accessToken', accessToken)
        const client = new FacebookClient()
        const pages = await client.findPages(accessToken)
        console.log('pages', pages)
        const firstPage = pages[0]
        console.log('firstPage', firstPage)
        const instagramAccountId = await client.getInstagramAccountId(firstPage.id, accessToken);
        console.log('instagram account id', instagramAccountId)
        const imageUrl = await client.upload(image)
        console.log('imageUrl', imageUrl)
        const mediaObjectContainer = await client.createMediaObjectContainer(instagramAccountId, imageUrl, 'Hello World!', accessToken)
        console.log('mediaObjectContainer', mediaObjectContainer)
        await client.publishMediaObjectContainer(instagramAccountId, mediaObjectContainer.id, accessToken)
        console.log('success!')
    }

    const onTwitterShareButtonPress = async () => {
        if (!twitterMediaAccessToken) {
            requestToken()
        } else {
            const media = await postMedia(image, twitterMediaAccessToken)
            const tweet = await postTweet(media.mediaId, twitterMediaAccessToken)
            console.log('tweet', tweet)
        }
    }

    if (twitterPinToken) {
        return (
            <View style={{flex: 1}}>
                <Text h1 style={styles.title}>
                    Enter the PIN to continue
                </Text>
                <TextInput
                    style={{
                        paddingLeft: 25,
                        fontSize: 25,
                        backgroundColor: '#FFFFFF',
                        height: 60,
                        marginLeft: 25,
                        marginRight: 25
                    }}
                    onChangeText={onChangePin}
                    id="pinInput"></TextInput>
                <View style={{
                    marginTop: 15,
                    marginLeft: 25,
                    height: 60,
                    flex: 1,
                    flexDirection: "row"
                }}>
                    <View>
                        <Button title="Submit" onPress={confirmPin}/>
                    </View>
                    <View>
                        <Button title="Cancel" onPress={cancelPin}/>
                    </View>
                </View>
            </View>
        )
    }

    console.log('image', image)

    return (
        <View style={{flex: 1}}>
            <Text h1 style={styles.title}>
                Post an image to facebook.
            </Text>
            <Button title="Pick an image from camera roll" onPress={pickImage}/>
            {image && image.uri &&
                <Image source={{uri: image.uri}} style={{width: 200, height: 200}}/>}
            <Button
                title="Share on Facebook"
                onPress={() => onShareButtonPress().then(() => console.log('Opened facebook share dialog!'))}
            />
            <Button
                title="Share on Instagram"
                onPress={() => onInstagramShareButtonPress().then(() => console.log('Opened instagram!'))}
            />
            <Button
                title="Share on Twitter"
                onPress={() => onTwitterShareButtonPress().then(() => console.log('Opened twitter!'))}
            />
            <Text style={styles.spacer}>&nbsp;</Text>
            <Button style={styles.homeButton} title="Home"
                    onPress={() => navigation.navigate('HomeScreen')}>Home</Button>
            <StatusBar style="auto"/>
        </View>
    );
};
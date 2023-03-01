import storage from "@react-native-firebase/storage"
import { v4 } from 'uuid'

export class InstagramClient {

   async getInstagramAccountId (facebookPageId, token) {
           const url = `https://graph.facebook.com/me/accounts/${facebookPageId}?fields=instagram_business_account`
           const response = await fetch(url, {
               method: 'GET',
               headers: {
                   Authorization: `Bearer ${token}`,
                   'accept': "application/json"
               }
           });
           const json = await response.json()
           console.log('json', json)
           const pages = json.data || []
           const firstPage = pages[0]
           const instagramAccount = firstPage['instagram_business_account']
           console.log('instagramAccount', instagramAccount)
           return instagramAccount.id
       }


    async createMediaObjectContainer (instagramAccountId, imageUrl, caption, token) {
           /*
           POST https://graph.facebook.com/{api-version}/{ig-user-id}/media
                   ?image_url={image-url}
               &is_carousel_item={is-carousel-item}
               &caption={caption}
               &location_id={location-id}
               &user_tags={user-tags}
               &product_tags={product-tags}
               &access_token={access-token}
           */
           try {
               const url = `https://graph.facebook.com/${instagramAccountId}/media?image_url=${imageUrl}&caption=${caption}`
               const response = await fetch(url, {
                   method: 'POST',
                   headers: {
                       Authorization: `Bearer ${token}`,
                       'accept': "application/json"
                   }
               });
               const status = response.status
               const json = await response.json()
               console.log('json', json)
               const id = json.id
               return {
                   id,
                   status
               }
           } catch (error) {
               console.error(error)
           }
       }

       async publishMediaObjectContainer (instagramAccountId, mediaObjectContainerId, token) {
           /*
           POST https://graph.facebook.com/{api-version}/{ig-user-id}/media-publish
           */
           try {
               const url = `https://graph.facebook.com/${instagramAccountId}/media_publish?creation_id=${mediaObjectContainerId}`
               const response = await fetch(url, {
                   method: 'POST',
                   headers: {
                       Authorization: `Bearer ${token}`,
                       'accept': "application/json"
                   }
               });
               const status = response.status
               const json = await response.json()
               console.log('json', json)
               const id = json.id
               return {
                   id,
                   status
               }
           } catch (error) {
               console.error(error)
           }
       }





}
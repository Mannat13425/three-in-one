import { v4 } from 'uuid'
import storage from "@react-native-firebase/storage"

export class FirebaseClient {

  async upload(image) {
        const imageUrl = image.uri
        const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
        const uuid = v4()
        const uniqueFilename = `${uuid}_${filename}`
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        console.log('blob created. ')
        const ref = storage()
            .ref()
            .child(uniqueFilename);
        console.log('uploading blob ... ')
        const task = await ref.put(blob);
        console.log("task", task)
        console.log('upload complete!')
        return await ref.getDownloadURL();
    }


}
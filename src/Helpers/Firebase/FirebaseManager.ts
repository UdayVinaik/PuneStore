import firestore from '@react-native-firebase/firestore'

class FirebaseManager {

  public async Add(schemaName: string, docId: string, obj: object) {
    try {
      await firestore().collection(schemaName).doc(docId).set(obj)
    } catch (err) {
      console.log('Error in Add function:', err)
    }
  }

  public async Delete(schemaName: string, docId: string) {
    try {
      await firestore().collection(schemaName).doc(docId).delete()
    } catch (err) {
      console.log('Error in delete function:', err)
    }
  }

  public async Update(schemaName: string, docId: string, obj: object) {
    try {
      await firestore().collection(schemaName).doc(docId).update(obj);
    } catch (err) {
      console.log('Error in update function:', err)
    }
  }

  public async Read(schemaName: string, entityName: string, entityValue?: string) {
    try {
      const dataArray: any = []
      const data = await firestore().collection(schemaName).where(entityName, '==', entityValue).get()
      data.forEach((documentSnapshot) => {
        dataArray.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })
      return dataArray
    } catch (err) {
      console.log('Error in Read function:', err)
    }
  }

  public async ReadAll(schemaName: string) {
    try {
      const dataArray: any = []
      const data = await firestore().collection(schemaName).get()
      data.forEach((documentSnapshot) => {
        dataArray.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        })
      })
      return dataArray
    } catch (err) {
      console.log('Error in Read function:', err)
    }
  }

  public async ReadSingleEntity(schemaName: string, entityName: string) {
    try {
      const data = await firestore().collection(schemaName).doc(entityName).get()
      return data?.data()
    } catch (err) {
      console.log('Error in Read function:', err)
    }
  }
}

const FBManager = new FirebaseManager()
export default FBManager
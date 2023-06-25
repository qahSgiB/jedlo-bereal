import ft from 'file-type'
import { apiDoClientError } from './api';



type FileType = 'image'



const validateFile = async (file: Buffer, type?: FileType): Promise<string | undefined> => {
  const pictureType = await ft.fromBuffer(file);

  if (pictureType === undefined) {
    return undefined;
  }

  let ok = false;
  if (type === 'image') {
    ok = pictureType.mime.split('/')[0] === 'image'
  }

  return ok ? pictureType.ext : undefined;
}



export default validateFile;
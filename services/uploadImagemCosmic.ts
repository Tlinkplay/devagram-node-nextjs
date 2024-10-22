import multer from 'multer';
import comicjs from 'cosmicjs';
import { write } from 'fs';

const {
CHAVE_GRAVACAO_AVATARES,
CHAVE_GRAVACAO_PUBLICACOES,
BUCKET_AVATARES,
BUCKET_PUBLICACOES} = process.env;

const Comisc = comicjs();
const bucketAvatares = Comisc.bucket({
  slug: BUCKET_AVATARES,
  write_key: CHAVE_GRAVACAO_AVATARES
});

const bucketPublicacoes = Comisc.bucket({
  slug: BUCKET_PUBLICACOES,
  write_key: CHAVE_GRAVACAO_PUBLICACOES
});

const storage = multer.memoryStorage();
const updload = multer({storage : storage});

const updloadImagemComisc = async(req : any) => {
    if(req?.file?.originalname){

      if(!req.file.originalname.includes('.png') &&
          !req.file.originalname.includes('.jpg') &&
          !req.file.originalname.includes('.jpeg')){
            throw new Error('Extensão da imagem invalida');
          }
          
      const media_object = {
        originalname: req.file.originalname,
        buffer : req.file.buffer
      };

      if(req.url && req.url.includes('publicacoes')){

        return await bucketPublicacoes.addMedia({media : media_object});
      }else{
        return await bucketAvatares.addMedia({media : media_object});
      }
    }
}

export {updload, updloadImagemComisc};
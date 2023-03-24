import multer from "multer";
import cosmicjs from "cosmicjs";

const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCHET_AVATARES,
    BUCHET_PUBLICACOES,
} = process.env

const Cosmic = cosmicjs()
const bucketAvatares = Cosmic.bucket ({
    slug: BUCHET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES,
})

const bucketPublicacoes = Cosmic.bucket ({
    slug: BUCHET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES
})

const storage = multer.memoryStorage()
const updloadMulter = multer({storage: storage})

const uploadImagemCosmic = async (req: any) => {
    if(req?.file?.originalname) {
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        }
        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media: media_object})
        }else{
            return await bucketAvatares.addMedia({media: media_object})
        }
    }
}

export {updloadMulter, uploadImagemCosmic}
import type { NextApiResponse } from "next";
import type { RespostaPadraoMSG } from "@/Types/RespostaPadraoMSG";
import nc from 'next-connect'
import { updloadMulter, uploadImagemCosmic } from "@/services/uploadImagemCosmic";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { PublicacaoModel } from "@/models/publicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";

const handler = nc()
    .use(updloadMulter.single('file'))
    .post(async (req: any, res: NextApiResponse<RespostaPadraoMSG>) => {
        try {
            const {userId} = req.query
            const usuario = await UsuarioModel.findById(userId)

            if(!usuario){
                return res.status(400).json({erro: 'Usuario não encontrado.'})
            }
    
            if(!req || !req.body){
                return res.status(400).json({erro: 'Parametro de entrada não informado.'})
            }
            const {descricao} = req.body

        if(!descricao || descricao.length <2){
            return res.status(400).json({erro: 'Descrição da publicação incorreta.'})
        }
        if(!req.file || !req.file.originalname){
            return res.status(400).json({erro: 'A imagem é obrigatória.'})
        }

        const image = await uploadImagemCosmic(req)

            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }
            await PublicacaoModel.create(publicacao)
            
            res.status(200).json({msg: 'Publicação criada com sucesso.'})

        } catch (e) {
            console.log(e)
            return res.status(400).json({erro: 'Erro ao cadastrar a publicacao.'})            
        }
        
    })
    



export const config = {
    api: {
        bodyParser: false
    }
}

export default validarTokenJWT(conectarMongoDB(handler))

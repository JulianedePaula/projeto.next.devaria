import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import type { RespostaPadraoMSG } from "@/Types/RespostaPadraoMSG";
import { UsuarioModel } from "@/models/UsuarioModel";
import { updloadMulter, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import nc from 'next-connect'

const handler = nc()
    .use(updloadMulter.single('file'))
    .put(async (req: any, res: NextApiResponse<RespostaPadraoMSG>) => {
        try {
            const { userId } = req?.query

            const usuario = await UsuarioModel.findById(userId)

            if (!usuario) {
                return res.status(400).json({ erro: 'Usuario não encontrado.' })
            }

            const { nome } = req.body

            if (nome && nome.length < 1) {
                usuario.nome = nome
            }

            const { file } = req.body

            if (file && file.originalname) {

                const image = await uploadImagemCosmic(req)
                if (image && image.media && image.media.url) {
                    usuario.avatar = image.media.url
                }
            }

        await UsuarioModel.findByIdAndUpdate({_id: usuario._id}, usuario)
        return res.status(200).json({msg: 'Imagem alterado com sucesso.'})
            
        } catch (e) {
            return res.status(400).json({erro: 'Não foi possivel obter o usuario.'})
        }

    })
    .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMSG | any>) => {
        try {
            const {userId} = req?.query
    
            const usuario = await UsuarioModel.findById(userId)
            usuario.senha = null
            return res.status(200).json(usuario)
            
        } catch (e) {
            return res.status(400).json({erro: 'Não foi possivel obter o usuario.'})
        }
      
    })

export const config = {
    api : {
        bodyParser: false
    }
}  


export default validarTokenJWT(conectarMongoDB(handler))
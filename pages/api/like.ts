import { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMSG } from "@/Types/RespostaPadraoMSG";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { PublicacaoModel } from "@/models/publicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";

const likeEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMSG>) => {
    try {
        if (req.method === 'PUT') {
            const {id} = req?.query

            const publicacao = await PublicacaoModel.findById(id)

            if (!publicacao) {
                return res.status(400).json({erro: 'Publicação não encontrada.'})
            }

            const {userId} = req?.query

            const usuario = await UsuarioModel.findById(userId)

            if (!usuario) {
                return res.status(400).json({erro: 'Usuario não encontrado.'})
            }

            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString())

            if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1)
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
                return res.status(200).json({msg: 'Publicacao descurtida com sucesso.'})

            } else {
                publicacao.likes.push(usuario._id)
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao)
                return res.status(200).json({msg: 'Publicacao curtida com sucesso.'})
            }
        } 
        return res.status(405).json({erro: 'Metodo incorreto.'})
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({erro: 'Ocorreu um erro ao curtir/descurtir uma publicação.'})
    }
}

export default validarTokenJWT(conectarMongoDB(likeEndpoint))
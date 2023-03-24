import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import type { RespostaPadraoMSG } from "@/Types/RespostaPadraoMSG";
import { UsuarioModel } from "@/models/UsuarioModel";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { PublicacaoModel } from "@/models/publicacaoModel";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMSG | any>) => {
    try {
        if (req.method === 'GET'){
            if (req?.query?.id) {
                const usuario = await UsuarioModel.findById(req?.query?.id)
                if (!usuario) {
                    return res.status(400).json({erro: 'Usuario não encontrado.'})
                }
                const publicacoes = await PublicacaoModel
                    .find({idUsuario : usuario._id})
                    .sort({data: -1})
                return res.status(200).json(publicacoes)
            }
            
        }
        return res.status(405).json({erro: 'Metodo informado incorreto.'})
        
    } catch (e) {
        //console.log(e)
        return res.status(400).json({erro: 'Não foi possivel carregar o feed.'})
    }

}

export default validarTokenJWT(conectarMongoDB(feedEndpoint))

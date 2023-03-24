import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import type { RespostaPadraoMSG } from "@/Types/RespostaPadraoMSG";
import { UsuarioModel } from "@/models/UsuarioModel";

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMSG | any>) => {

    try {
        const {userId} = req?.query

        const usuario = await UsuarioModel.findById(userId)
        usuario.senha = null
        return res.status(200).json(usuario)
        
    } catch (e) {
        return res.status(400).json({erro: 'Não foi possivel obter o usuario.'})
    }
  
}

export default validarTokenJWT(usuarioEndpoint)
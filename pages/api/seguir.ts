import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMSG } from "@/Types/RespostaPadraoMSG";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { SeguidorModel } from "@/models/seguidorModel";

const seguirEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMSG>) => {
    try {
        if (req.method === 'PUT') {
            const {userId, id} = req?.query

            // usuario logado vindo do token.
            const usuarioLogado = await UsuarioModel.findById(userId)

            if (!usuarioLogado) {
                return res.status(400).json({erro: 'Usuario não está logado.'})
            }
            // ID do usuario a ser seguido - query.
            const usuarioAserSeguido = await UsuarioModel.findById(id)
            if (!usuarioAserSeguido) {
                return res.status(400).json({erro: 'Usuario a ser seguido não encontrado.'})
            }
            // Buscar se LOGADO sigo ou não o usuario.
            const euJasigoEsseUsuario = await SeguidorModel
                .find({usuarioId: usuarioLogado._id, usuarioSeguidorID : usuarioAserSeguido._id})
            if (euJasigoEsseUsuario && euJasigoEsseUsuario.length > 0) {
                // Se encontrou alguém, sinal de que sigo o usuario então deixar de seguir.
                euJasigoEsseUsuario.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id: e._id}))
                usuarioLogado.seguindo--
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado)
                usuarioAserSeguido.seguidores--
                await UsuarioModel.findByIdAndUpdate({_id: usuarioAserSeguido._id}, usuarioAserSeguido)

                return res.status(200).json({msg: 'Deixou de seguir o usuario com sucesso.'})
            } else {
                // Se não encontrou, sinal de que não sigo.
                const seguidor = {
                    usuarioID : usuarioLogado._id,
                    usuarioSeguidorID : usuarioAserSeguido._id
                }
                await SeguidorModel.create(seguidor)
                // Aumentar o numero de 'seguindo'.
                usuarioLogado.seguindo++
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado)

                // Aumentando o numero de 'seguidores'.
                usuarioAserSeguido.seguidores++
                await UsuarioModel.findByIdAndUpdate({_id: usuarioAserSeguido._id}, usuarioAserSeguido)

                return res.status(200).json({msg: 'Usuario seguido com sucesso.'})
            }
        }
        return res.status(405).json({erro: 'Metodo informado não existe.'})
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({erro: 'não foi possivel seguir ou deixar de seguir o usuario.'})
    }
}

export default validarTokenJWT(conectarMongoDB(seguirEndpoint))
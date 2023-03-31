import { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMSG } from '@/Types/RespostaPadraoMSG'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT'
import nc from 'next-connect'
import { UsuarioModel } from '@/models/UsuarioModel'

const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMSG | any[]>) => {
    try {
        if (req.method === 'GET'){
            if(req?.query?.id){
                const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id)

                if(!usuarioEncontrado){
                    return res.status(400).json({erro: 'Usuario não encontrado.'})
                }
                return res.status(200).json(usuarioEncontrado)

            }else{
            const { filtro } = req.query

            if(!filtro || filtro.length < 2) {
                return res.status(400).json({erro: 'Campo de pesquisa vazio.'})
            }

            const usuariosEncontrados = await UsuarioModel.find({
                $or: [{nome : {$regex: filtro, $options: 'i'}},
                {email : {$regex: filtro, $options: 'i'}}]
                
            })
            return res.status(200).json(usuariosEncontrados)

            }

        } return res.status(400).json({erro: 'Metodo incorreto.'})
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({erro: 'Não foi possivel bscar o usuario.'})
        
    }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint))
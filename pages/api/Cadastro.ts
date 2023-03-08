import type { NextApiRequest, NextApiResponse } from "next";
import type { CadastroRequisicao } from "@/Types/CadastroRequisicao";
import type { RespostaPadraoMSG } from "@/Types/RespostaPadraoMSG";
import { UsuarioModel } from "@/models/UsuarioModel";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import md5 from "md5";

const endpointCadastro = 
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMSG>) => {

        if(req.method === 'POST'){
            const usuario = req.body as CadastroRequisicao

            if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({erro:'Nome de usuario invalido.'})
            }
            //Cadastrando e-mail
            if(!usuario.email || usuario.email.length < 5){
                return res.status(400).json({erro:'E-mail de usuario invalido.'})
            }
            //Verificando se não tem o mesmo e-mail cadastrado.
            const usuarioDuplicidade = await UsuarioModel.find({email : usuario.email})
            if(usuarioDuplicidade && usuarioDuplicidade.length > 0){
                return res.status(400).json({erro: 'Email já cadastrado.'})
            }
            //Cadastrando a senha
            if(!usuario.senha || usuario.senha.length < 0){
                return res.status(400).json({erro:'Senha de usuario invalido.'})
            }
            const UsuarioASerSalvo = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha)
            }
            await UsuarioModel.create(UsuarioASerSalvo)
            return res.status(200).json({msg: 'Usuario cadastrado com sucesso.'})

        } return res.status(405).json({erro: 'Metodo incorreto.'})
    }

export default(conectarMongoDB(endpointCadastro))
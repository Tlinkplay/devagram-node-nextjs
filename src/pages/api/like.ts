import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../../types/RespostaPadraoMsg';
import { conectarMongoDB } from "../../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../../middlewares/validarTokenJWT";
import { UsuarioModel } from "../../../models/UsuarioModel";
import { useEffect } from "react";
import { PublicacaoModel } from "../../../models/PublicacaoModel";

const likeEndPoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

    try {

        if(req.method === 'PUT'){
            
            const {id} = req?.query;
            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro : 'Publicação não encontrada'});
            }

            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario não encontrado'});
        }

            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());

            if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publiação descurtida com sucesso'});
            }else{
                publicacao.likes.push(usuario._id);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicação curtida com sucesso'});
            }
        }
        return res.status(405).json({erro : 'Metodo informado invalido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({erro : 'Ocorreu um erro ao curtir/descurtir uma publicação'})
    }
}

export default validarTokenJWT(conectarMongoDB(likeEndPoint));
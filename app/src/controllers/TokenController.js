import dotenv from 'dotenv';
dotenv.config();

import Usuario from '../models/Usuario';
import jwt from 'jsonwebtoken';

class TokenController {
  async matchPassword(req, res) {
    try {
      const { usuario, senha } = req.body;
      if (!usuario || !senha) {
        return res
          .status(400)
          .json({ message: "Os campos 'usuário' e 'senha' precisam ser enviados" });
      }

      const user = await Usuario.findByUsername(usuario);
      if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }

      const senhaValida = await Usuario.comparePassword(senha, user.senha_hash);
      if (!senhaValida) {
        return res.status(400).json({ message: 'Senha incorreta' });
      }

      const payload = {
        id: user.id,
        nome: user.usuario,
        email: user.email,
        admin: user.admin,
        supervisor: user.supervisor,
      };

      const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRATION,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 30 * 6, // 180 dias
      });

      return res.status(200).json({
        message: `${user.usuario}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao fazer login.', details: error.message });
    }
  }

  async logout(req, res) {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: new Date(0),
    });

    return res.status(200).json({ message: 'Deslogado com sucesso' });
  }
}

export default new TokenController();

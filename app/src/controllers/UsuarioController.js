import Usuario from '../models/Usuario.js';
import Departamento from '../models/Departamento.js';

const sanatizeUser = (user) => {
  if (user) {
    const sanitized = { ...user };
    delete sanitized.senha_hash;
    return sanitized;
  }
  return user;
};

const UsuarioController = {
  async create(req, res) {
    try {
      const { nome, email, senha, supervisor, admin, departamento_id } = req.body;
      if (!nome || !email || !senha || !departamento_id) {
        return res.status(400).json({
          message: "Os campos 'nome', 'email', 'senha' e 'departamento_id' são obrigatórios.",
        });
      }

      const emailExistente = await Usuario.findByEmail(email);
      if (emailExistente) {
        return res.status(409).json({ message: 'Este email já está em uso.' }); // 409 Conflict
      }

      // Validação: Busca o departamento pelo nome
      const departamento = await Departamento.findById(departamento_id);
      if (!departamento) {
        return res
          .status(404)
          .json({ message: `Departamento '${departamento_id}' não encontrado.` });
      }

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha,
        supervisor,
        admin,
        departamento_id: departamento.id,
      });

      res.status(201).json(sanatizeUser(novoUsuario));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar usuário.', details: error.message });
    }
  },

  async listAll(req, res) {
    try {
      const filters = req.query;
      const usuarios = await Usuario.findAll(filters);
      res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar usuários.', details: error.message });
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar usuário.', details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      // Pegamos apenas os campos que podem ser atualizados
      const { nome, email, senha, supervisor, departamento_id } = req.body;

      if (departamento_id) {
        const departamento = await Departamento.findById(departamento_id);
        if (!departamento) {
          return res
            .status(404)
            .json({ message: `Departamento '${departamento_id}' não encontrado.` });
        }
        departamento_id = departamento.id;
      }

      const dadosParaAtualizar = { nome, email, senha, supervisor, departamento_id };

      const usuarioAtualizado = await Usuario.update(id, dadosParaAtualizar);

      if (!usuarioAtualizado) {
        return res.status(404).json({ message: 'Usuário não encontrado para atualizar.' });
      }

      res.status(200).json(sanatizeUser(usuarioAtualizado));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar usuário.', details: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await Usuario.delete(id);
      if (!sucesso) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar usuário.', details: error.message });
    }
  },

  async findByUsername(req, res) {
    try {
      const { username } = req.body;
      Usuario.findByUsername(username);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar usuário.', details: error.message });
    }
  },

  async promoteToSupervisor(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      if (usuario.admin) {
        return res
          .status(400)
          .json({ message: 'Não é possível alterar o status de supervisor de um administrador.' });
      }

      const novoStatus = !usuario.supervisor;

      const usuarioAtualizado = await Usuario.update(id, { supervisor: novoStatus });

      res.status(200).json(sanatizeUser(usuarioAtualizado));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao alterar status de supervisor.', details: error.message });
    }
  },
};

export default UsuarioController;

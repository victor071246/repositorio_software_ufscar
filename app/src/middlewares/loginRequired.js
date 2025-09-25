import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import path from 'path';

export default async (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token recebido:', token);

  if (!token) {
    console.log('Token não recebido');
  }
};

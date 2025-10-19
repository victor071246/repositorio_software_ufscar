import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);

export type UserPayload = {
  id: number;
  usuario: string;
  admin: boolean;
  supervisor: boolean;
};

export async function getUserFromServer(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies();

    const token = (await cookieStore).get('token')?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);

    return payload as UserPayload;
  } catch (e) {
    console.error('Erro ao validar token: ', e);
    return null;
  }
}

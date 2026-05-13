import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from '../models/usuario.model';
import { UserRole } from '../enums/roles.enum';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  rol: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
  }

  async validate(payload: JwtPayload): Promise<Usuario> {
    const { sub } = payload;
    
    const usuario = await this.usuarioModel.findById(sub).select('-password');

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Token inválido o usuario inactivo');
    }

    return usuario;
  }
}

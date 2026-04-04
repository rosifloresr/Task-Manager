import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RemoteAuthGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException('No se proporcionó token');

    const token = authHeader.split(' ')[1];

    try {
      // 🛰️ Todos los microservicios llamarán a este mismo endpoint central
      const { data } = await firstValueFrom(
        this.httpService.get(`http://localhost:3001/validate?token=${token}`)
      );

      request.user = data; // Inyectamos el usuario (id, email, role)
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token inválido o Auth Service offline');
    }
  }
}
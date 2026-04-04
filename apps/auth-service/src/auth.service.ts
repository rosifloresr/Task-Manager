import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ){}

    async register(registerDto: RegisterDto){
        const {email, password} = registerDto;

        const userExists = await this.prisma.user.findUnique({where: {email}});
        if (userExists) throw new BadRequestException('Usuario existente');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data:{
                email,
                password: hashedPassword,
            },
        });

        const { password: _, ...result} = user;
        return result;

    }

    async login(loginDto: LoginDto){
        const {email, password} = loginDto;

        const user = await this.prisma.user.findUnique({where: {email}});
        if (!user) throw new UnauthorizedException('Credenciales invalidas');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Credenciales invalidas');

        const payload = {id: user.id, email: user.email, role: user.role};
        return {
            user: {email: user.email, role: user.role},
            token: this.jwtService.sign(payload),
        }
    }

    async validateToken(token: string){
        try{
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            
            return {
                id: payload.id,
                email: payload.email,
                role: payload.role,
                valid: true,
            };
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }

}

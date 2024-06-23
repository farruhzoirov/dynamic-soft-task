import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {Roles } from '../enums/roles.enum'

@Injectable()
export class AdminManagerGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<Roles[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const token =  authHeader.split(' ')[1];
        if (!token) {
            throw new ForbiddenException('No token provided');
        }

        const user = this.jwtService.verify(token);
        request.user = user

        if (!user || user.role !== Roles.admin || user.role !== Roles.manager) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }
        return true;
    }
}




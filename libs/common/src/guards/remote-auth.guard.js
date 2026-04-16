"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let RemoteAuthGuard = class RemoteAuthGuard {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader)
            throw new common_1.UnauthorizedException('No se proporcionó token');
        const token = authHeader.split(' ')[1];
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`http://localhost:3001/validate?token=${token}`));
            request.user = data;
            return true;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Token inválido o Auth Service offline');
        }
    }
};
exports.RemoteAuthGuard = RemoteAuthGuard;
exports.RemoteAuthGuard = RemoteAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], RemoteAuthGuard);
//# sourceMappingURL=remote-auth.guard.js.map
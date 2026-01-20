import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('/login')
    @Public()
    async login(@Body() loginUserDTO:LoginUserDTO){
       return this.authService.login(loginUserDTO)
    }
}

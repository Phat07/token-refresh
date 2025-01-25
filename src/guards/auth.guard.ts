import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users/users.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private configService: ConfigService, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // Try to get the token from the Authorization header or request params
      const authHeader = request.headers.authorization;
      const token =
        request.params.token || // Check for token in request parameters
        (authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.split(' ')[1]
          : null);

      if (!token) {
        throw new ForbiddenException('Access token is missing');
      }
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new BadRequestException('JWT_SECRET is not set');
      }

      // Verify the token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      console.log("Decoded Payload: ", payload); 

      // Find the user in the database
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException(
          'User does not belong to the token, please try again',
        );
      }

      // Attach the user to the request object
      request.currentUser = user;
      return true;
    } catch (error) {
      console.error('AuthGuard Error:', error); // Log the error for debugging
      throw new ForbiddenException('Invalid token or token has expired');
    }
  }
}

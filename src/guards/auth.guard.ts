// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   BadRequestException,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from 'src/users/services/users/users.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private userService: UsersService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     try {
//       // 1) Get token from header
//       // const token = request.headers.authorization.split(' ')[1];
//       const token =
//         request.params.token ||
//         (request.headers.authorization &&
//           request.headers.authorization.split(' ')[1]);

//       if (!token) {
//         throw new ForbiddenException('Please provide access token');
//       }

//       // 2) jwtVerify validate token
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: process.env.JWT_SECRET,
//       });
//       // 3) find user in db based on jwtVerify
//       const user = await this.userService.findByEmail(payload.email);
//       if (!user) {
//         throw new BadRequestException(
//           'User not belong to token, please try again',
//         );
//       }
//       // 4) Assign user to request object
//       request.currentUser = user;
//     } catch (error) {
//       throw new ForbiddenException('Invalid token or expired');
//     }
//     return true;
//   }
// }
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
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

      // Verify the token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

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

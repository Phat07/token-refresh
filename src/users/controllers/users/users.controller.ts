import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthService } from 'src/users/auth.service';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { Roles } from 'src/users/decorators/roles.decorator';
import { IdTokenDto } from 'src/users/dto/idToken.dto';
import { LoginUserDto } from 'src/users/dto/loginUser.dto';
import { RefreshTokenDto } from 'src/users/dto/refreshToken.dto';
import { RegisterUserDto } from 'src/users/dto/registerUser.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('/api/v1/users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/GoogleLogin')
  @ApiOperation({ summary: 'Đăng nhập google' })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  loginGoogle(@Body() requestBody: IdTokenDto) {
    return this.authService.verifyGoogleToken(requestBody);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  registerUser(@Body() requestBody: RegisterUserDto) {
    return this.authService.register(requestBody);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Đăng nhập tài khoản' })
  loginUser(@Body() requestBody: LoginUserDto) {
    return this.authService.login(requestBody);
  }

  @Get('')
  @ApiOperation({ summary: 'Lấy tất cả user' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng kết quả mỗi trang',
    example: 10,
  })
  @Roles('Customer', 'ProductOwner')
  @UseGuards(AuthGuard, RoleGuard)
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.userService.findAll({ page, limit });
  }

  @Get('/current-user/:token?') // ? makes the token parameter optional
  @ApiOperation({ summary: 'Lấy thông tin user by token' })
  @ApiParam({
    name: 'token',
    required: false,
    description: 'JWT token for user verification',
  }) // Swagger documentation for the token parameter
  @UseGuards(AuthGuard) // Keep the AuthGuard
  async getCurrentUser(
    @Param('token') token: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.userService.findUserWithRole(currentUser.id);
  }

  @Post('/refreshToken') // Thay đổi từ GET thành POST
  @ApiOperation({ summary: 'RefreshToken cho người dùng' })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto, // Sử dụng DTO ở đây
  ) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken); // Gọi hàm refreshToken trong AuthService
  }
}

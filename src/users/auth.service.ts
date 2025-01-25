import {
  BadRequestException,
  Injectable,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserHelper } from 'src/helpers/user.helper';
import { UsersService } from './services/users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { ResponseDto } from './response/response.dto';
import { RegisterResponseDto } from './response/registerResponse.dto';
import { Token } from 'src/token/entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { add } from 'date-fns';
import { OAuth2Client } from 'google-auth-library';
import { IdTokenDto } from './dto/idToken.dto';
import { UserRole } from 'src/roles/enums/role.enum';
import { Admin } from 'src/admin/entities/admin.entity';
import { Owner } from 'src/owner/entities/owner.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Injectable()
export class AuthService {
  private readonly oauthClient: OAuth2Client;
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    @InjectRepository(Token) private tokenRepo: Repository<Token>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Owner) private ownerRepository: Repository<Owner>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    // @InjectRepository(Customer) private userRepository: Repository<Admin>,
  ) {
    this.oauthClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }
  async verifyGoogleToken(requestBody: IdTokenDto) {
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: requestBody.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }
      const data = {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        googleId: payload.sub,
      };
      return {
        msg: 'Login google success!',
        data: data,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }

  // async register(requestBody: RegisterUserDto) {
  //   // check email is exist
  //   const userByEmail = await this.userService.findByEmail(requestBody.email);
  //   if (userByEmail) {
  //     throw new BadRequestException('Email already exist!');
  //   }

  //   // hash password
  //   const hashedPassword = await bcrypt.hash(requestBody.password, 10);
  //   requestBody.password = hashedPassword;

  //   // save to db
  //   const savedUser = await this.userService.create(requestBody);

  //   // generate jwt token
  //   const payload = UserHelper.generateUserPayload(savedUser);

  //   const access_token = await this.jwtService.signAsync(payload, {
  //     secret: process.env.JWT_SECRET,
  //   });

  //   return {
  //     msg: 'User has been created!',
  //     access_token,
  //     data: savedUser,
  //   };
  // const response: ResponseDto<RegisterResponseDto> = {
  //   msg: 'User has been created!',
  //   success: true,
  //   data: {
  //     id: savedUser.id,
  //     email: savedUser.email,
  //     name: savedUser.name,
  //     roleName: savedUser.role,
  //     access_token,
  //   },
  // };

  // return response;
  // }
  async register(requestBody: RegisterUserDto) {
    // Check if email already exists
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (userByEmail) {
      throw new BadRequestException('Email already exists!');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(requestBody.password, 10);

    // Prepare user entity
    const newUser = {
      ...requestBody,
      password: hashedPassword,
      googleId: null, // Explicitly set googleId to null
    };

    // Save user to database
    const savedUser = await this.userService.create(newUser);

    if (requestBody.roleName === UserRole.PRODUCT_OWNER) {
      // Create an Owner record
      const owner = this.ownerRepository.create({ user: savedUser });
      await this.ownerRepository.save(owner);
    } else if (requestBody.roleName === UserRole.CUSTOMER) {
      // Validate salonId
      // Create an Employee record
      const customer = this.customerRepository.create({ user: savedUser });
      await this.customerRepository.save(customer);
    } else if (requestBody.roleName === UserRole.ADMIN) {
      // Create an Admin record
      const admin = this.adminRepository.create({
        user: savedUser,
        permissions: 'ALL',
      });
      await this.adminRepository.save(admin);
    }
    // Create wallet for the user
    const wallet = this.walletRepository.create({
      user: savedUser,
      balance: 0, // Set default balance
    });
    await this.walletRepository.save(wallet);

    // Generate JWT token
    const payload = UserHelper.generateUserPayload(savedUser);
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'User has been created!',
      access_token,
      data: savedUser,
    };
  }

  async login(requestBody: LoginUserDto) {
    const userByEmail = await this.userService.findByEmail(requestBody.email);

    if (!userByEmail) {
      throw new BadRequestException('Gmail không chính xác!');
    }

    // check password

    const isMatchPassword = await bcrypt.compare(
      requestBody.password,
      userByEmail.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('Mật khẩu không chính xác!');
    }

    // generate jwt token
    const payload = UserHelper.generateUserPayload(userByEmail);
    console.log('pay', payload);

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d', // Set the refresh token expiration to 30 days
    });
    const tokenEntry = new Token();
    tokenEntry.user = userByEmail;
    tokenEntry.accessToken = accessToken;
    tokenEntry.refreshToken = refreshToken;
    tokenEntry.accessTokenExpiresAt = add(new Date(), { hours: 1 });
    tokenEntry.refreshTokenExpiresAt = add(new Date(), { days: 30 });

    await this.tokenRepo.save(tokenEntry);
    return {
      msg: 'User has been login successfully!',
      accessToken,
      refreshToken,
      data: userByEmail,
    };
  }
  async refreshToken(refreshToken: string) {
    // Tìm refresh token trong database
    const tokenEntry = await this.tokenRepo.findOne({
      where: { refreshToken },
    });

    if (!tokenEntry) {
      throw new BadRequestException('Refresh token không hợp lệ!');
    }

    // Kiểm tra refresh token có hết hạn không
    const currentTime = new Date();
    if (tokenEntry.refreshTokenExpiresAt < currentTime) {
      throw new BadRequestException('Refresh token đã hết hạn!');
    }

    // Lấy thông tin người dùng
    const user = await this.userService.findUserWithRole(tokenEntry.userId);
    if (!user) {
      throw new BadRequestException('Người dùng không tìm thấy!');
    }

    // Kiểm tra access token có thực sự cần refresh không (optional)
    const decoded = this.jwtService.decode(refreshToken) as any;
    if (decoded && decoded.exp * 1000 > Date.now() + 5 * 60 * 1000) {
      throw new BadRequestException(
        'Access token vẫn còn hạn, không cần refresh!',
      );
    }

    // Tạo access token mới
    const payload = UserHelper.generateUserPayload(user);
    const newAccessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    // Tạo refresh token mới
    const newRefreshToken = await this.jwtService.signAsync(
      { userId: user.id },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      },
    );

    // Cập nhật refresh token trong DB
    tokenEntry.refreshToken = newRefreshToken;
    tokenEntry.refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ); // 7 ngày
    await this.tokenRepo.save(tokenEntry);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

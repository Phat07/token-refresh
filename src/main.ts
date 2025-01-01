import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRole } from './roles/enums/role.enum';
import { Role } from './roles/entities/role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // or specify your allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // có thể truyền dư thông tin truyền về
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
      forbidNonWhitelisted: true,
    }),
  );
  const dataSource: DataSource = app.get(DataSource); // Get the TypeORM DataSource
  await seedRoles(dataSource);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('users', 'User management endpoints')
    .addTag('auth', 'Authentication endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  async function seedRoles(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(Role);

    // Define the default roles
    const roles = [
      { role: UserRole.ADMIN, description: 'Administrator role' },
      { role: UserRole.CUSTOMER, description: 'Customer role' },
      { role: UserRole.PRODUCT_OWNER, description: 'Product Owner role' },
      { role: UserRole.EMPLOYEE, description: 'Employee role' },
    ];

    // Check and insert each role if it doesn't already exist
    for (const role of roles) {
      const existingRole = await roleRepository.findOneBy({ role: role.role });
      if (!existingRole) {
        const newRole = roleRepository.create(role);
        await roleRepository.save(newRole);
      }
    }

    console.log('Roles seeded successfully!');
  }
  await app.listen(3000);
}
bootstrap();

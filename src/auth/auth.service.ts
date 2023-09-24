import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async register(createuserdto: CreateAuthDto) {
    const hashPassword = await bcrypt.hash(createuserdto.password, 10);

    return await this.prisma.user.create({
      data: {
        ...createuserdto,
        password: hashPassword,
      },
    });
  }

  async login(createUserDto: CreateAuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { username: createUserDto.username },
    });

    if (!user) {
      return new UnauthorizedException('User Tidak Ditemukan');
    }

    const password = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!password) {
      return new UnauthorizedException('Password Salah');
    }

    ///arrival
    const arrival = await this.prisma.arrival.create({
      data: {
        enter: new Date(),
        userId: user.id,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: 1 },
    });

    return await this.prisma.arrival.findFirst({
      where: {
        id: arrival.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
  async logout(username: string) {
    const user = await this.prisma.user.findFirst({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException('User Tidak Ditemukan');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isActive: 0 },
    });

    // const logout = await this.prisma.arrival.create({
    //   data: {
    //     out: new Date(),
    //     userId: user.id,
    //   },
    // });

    const arrival = await this.prisma.arrival.findFirst({
      where: { userId: user.id },
    });

    const arrivalUpdate = await this.prisma.arrival.update({
      where: { id: arrival.id },
      data: {
        out: new Date()
      },
    });

    return await this.prisma.arrival.findFirst({
      where: {
        id: arrival.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
}

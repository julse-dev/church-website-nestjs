import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { ChurchNewsBoardsModule } from './church-news-boards/church-news-boards.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    ChurchNewsBoardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

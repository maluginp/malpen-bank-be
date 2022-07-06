import { FrontendMiddleware } from './frontend.middleware';
import { CacheModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TransferModule } from './transfer/transfer.module';
import { WalletModule } from './wallet/wallet.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { WalletEntity } from './wallet/entities/wallet.entity';
import { TokenModule } from './token/token.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionEntity } from './transaction/entities/transaction.entity';
import { AccountModule } from './account/account.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_BASE'),
        entities: [
          UserEntity, WalletEntity, TransactionEntity
        ]
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TransferModule,
    WalletModule,
    WithdrawalModule,
    TokenModule,
    TransactionModule,
    CacheModule.register({
      isGlobal: true,
    }),
    AccountModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      useFactory: async (config: ConfigService) => (
        [
          {
            rootPath: join(__dirname, config.getOrThrow('SITE_DIR')),
          }
        ]
      ),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(frontEnd: MiddlewareConsumer) {
    frontEnd.apply(FrontendMiddleware).exclude({
      path: "/api",
      method: RequestMethod.ALL
    })
    frontEnd.apply(FrontendMiddleware).forRoutes(
      {
        path: '/site/**',
        method: RequestMethod.GET
      }
    );
  }
}

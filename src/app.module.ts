import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/products/products.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleModule as CustomScheduleModule } from './modules/schedule/schedule.module';
import { ReportModule } from './modules/reports/report.module';
import { ormConfig } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig),
    ProductModule,
    CustomScheduleModule,
    ReportModule,
    ScheduleModule.forRoot(),
    AuthModule,
  ],
})
export class AppModule {}

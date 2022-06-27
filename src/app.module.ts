import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { PokemonEntity } from './entities/pokemon.entity';
import { LogrequestMiddleware } from './Middleware/logrequest.middleware';

@Module({
  imports: [PokemonModule, TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'pokemondb',
    entities: [PokemonEntity],
    synchronize: false,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogrequestMiddleware).forRoutes('*');
  }
}

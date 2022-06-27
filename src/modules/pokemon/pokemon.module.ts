import { PokemonService } from './../../service/pokemon.service';
import { PokemonController } from './../../controllers/pokemon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonEntity } from 'src/entities/pokemon.entity';
import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
    imports: [HttpModule,TypeOrmModule.forFeature([PokemonEntity])],
    controllers: [PokemonController],
    providers: [PokemonService]
})
export class PokemonModule { }

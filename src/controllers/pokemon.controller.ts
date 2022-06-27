import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { of } from 'rxjs';
import { DataRespon } from 'src/Base/DataResponse';
import { isNullObj } from 'src/Base/Fucntion';
import { IBaseController } from 'src/Base/IBaseController';
import { PokemonEntity } from 'src/entities/pokemon.entity';
import { PokemonService } from 'src/service/pokemon.service';
import { Response } from 'express';
import { ExecException } from 'child_process';
@Controller("pokemon")
export class PokemonController implements IBaseController {
    constructor(
        private service: PokemonService
    ) {
    }
    @Get()
    get(@Res() res: Response) {
        try {
            this.service.get().subscribe((result: PokemonEntity[]) => {
                res.send(new DataRespon<PokemonEntity[]>(result, HttpStatus[HttpStatus.OK], HttpStatus.OK))
            }, (error: Error) => {
                res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
            })
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
        }
    }
    @Get("/:name")
    getByName(@Param('name') name: string, @Res() res: Response) {
        try {
            this.service.getByName(name).subscribe((result: PokemonEntity) => {
                res.send(new DataRespon<PokemonEntity>(result, HttpStatus[HttpStatus.OK], HttpStatus.OK))
            }, (error: Error) => {
                res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
            })
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
        }
    }
    @Post()
    onCreate(@Body() item: PokemonEntity, @Res() res: Response) {
        try {
            this.service.validateByduplicatename(item.name).subscribe((duplicate) => {
                if (!duplicate) {
                    this.service.onCreate(item).subscribe((result: PokemonEntity) => {
                        res.send(new DataRespon<PokemonEntity>(result, HttpStatus[HttpStatus.OK], HttpStatus.OK))
                    }, (error: Error) => {
                        res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
                    })
                } else {
                    res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
                }
            })

        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
        }
    }
    @Put("/:id")
    onUpdate(@Param('id') id: string, @Body() item: PokemonEntity, @Res() res: Response) {
        try {
            this.service.onUpdate(id, item).subscribe((result: PokemonEntity) => {
                res.send(new DataRespon<PokemonEntity>(result, HttpStatus[HttpStatus.OK], HttpStatus.OK))
            }, (error: Error) => {
                res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
            })
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
        }
    }
    @Delete("/:id")
    onDelete(@Param('id') id: string, @Res() res: Response) {
        try {
            this.service.onDelete(id).subscribe(() => {
                res.send(new DataRespon("deletesuccess", HttpStatus[HttpStatus.OK], HttpStatus.OK))
            }, (error: Error) => {
                res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
            })
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send(new DataRespon(null, HttpStatus[HttpStatus.BAD_REQUEST], HttpStatus.BAD_REQUEST))
        }
    }

}

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { interval, Observable } from 'rxjs';
import { IsAffected, isNullObj } from 'src/Base/Fucntion';
import { IBaseService } from 'src/Base/IBaseService';
import { PokemonEntity } from 'src/entities/pokemon.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
interface datarespon {
    data: {
        pokemon: pokemon[]
    }
}
interface pokemon {
    pokemon: PokemonEntity
}
@Injectable()
export class PokemonService implements IBaseService {
    private url: string = "https://pokeapi.co/api/v2/type/grass"
    private autoCreatePokemon = interval(60000);
    constructor(
        @InjectRepository(PokemonEntity)
        private Repo: Repository<PokemonEntity>,
        private httpService: HttpService
    ) {
        this.autoCreatePokemon.subscribe(() => {
            this.createPokemon().subscribe((create: boolean) => {
                // console.log(create);
            })
        })
    }

    get(): Observable<PokemonEntity[]> {
        try {
            return new Observable((obs) => {
                this.Repo.find().then((result: PokemonEntity[]) => {
                    obs.next(result)
                }).catch((error) => {
                    obs.error(error)
                });
            })
        } catch (error) {
            throw error
        }
    }
    private getById(id: string): Observable<PokemonEntity> {
        try {
            return new Observable((obs) => {
                this.Repo.findOneBy({ id }).then((result: PokemonEntity) => {
                    obs.next(result)
                }).catch((error) => {
                    obs.error(error)
                });
            })
        } catch (error) {
            throw error
        }
    }
    getByName(name: string): Observable<PokemonEntity> {
        try {
            return new Observable<PokemonEntity>((obs) => {
                this.Repo.findOne({
                    where: {
                        name: name
                    }
                }).then((result: PokemonEntity) => {
                    obs.next(result)
                }).catch((error) => {
                    obs.error(error)
                });
            })
        } catch (error) {
            throw error;

        }

    }
    onCreate(item: PokemonEntity): Observable<PokemonEntity> {
        try {
            return new Observable((obs) => {
                this.Repo.save(item).then((newPokemon: PokemonEntity) => {
                    obs.next(newPokemon)
                }).catch((error) => {
                    obs.error(error)
                });

            })

        } catch (error) {
            throw error;

        }
    }
    onUpdate(id: string, item: PokemonEntity): Observable<PokemonEntity> {
        try {
            return new Observable((obs) => {
                this.Repo.update(id, item).then((data: UpdateResult) => {
                    if (IsAffected(data)) {
                        this.getById(id).subscribe((result) => {
                            obs.next(result)
                        })
                    } else {
                        throw `Update => :${item.name} fail`
                    }

                }).catch((error) => {
                    obs.error(error)
                });
            })

        } catch (error) {
            throw error;

        }
    }
    onDelete(id: string): Observable<string> {
        try {
            return new Observable((obs) => {
                this.Repo.delete(id).then((data: DeleteResult) => {
                    console.log(data);
                    if (IsAffected(data)) {
                        obs.next("Delete Success")
                    } else {
                        throw `Delete fail`
                    }

                }).catch((error) => {
                    obs.error(error)
                });
            })
        } catch (error) {
            throw error;
        }
    }
    validateByduplicatedata(obj: PokemonEntity): Observable<boolean> {
        try {
            return new Observable((obs) => {
                this.Repo.findOne({ where: obj }).then((result) => {
                    if (result) {
                        obs.next(true)
                    } else {
                        obs.next(false)
                    }
                }).catch((error) => {
                    obs.next(false)
                    console.log(error);

                })
            })
        } catch (error) {
            throw new Error(error)
        }
    }
    validateByduplicatename(name: string): Observable<boolean> {
        try {
            return new Observable((obs) => {
                this.Repo.findOne({
                    where: {
                        name: name
                    }
                }).then((result) => {
                    if (result) {
                        obs.next(true)
                    } else {
                        obs.next(false)
                    }
                }).catch((error) => {
                    obs.next(false)
                    console.log(error);

                })
            })
        } catch (error) {
            throw new Error(error)
        }
    }
    getPokemonTypeGrass(): Observable<PokemonEntity> {
        return new Observable((obs) => {
            this.httpService.get(this.url).subscribe((response: datarespon) => {
                if (!isNullObj(response.data)) {
                    let result = response.data;
                    let ListPokemon: pokemon[] = result.pokemon;
                    ListPokemon.forEach((element: pokemon) => {
                        let pokenmon: PokemonEntity = element.pokemon
                        obs.next(pokenmon);
                    });
                } else {
                    obs.error("No Information")
                }
            }, (error: any) => {
                obs.error(error)
            }, () => {
                obs.complete()
            })
        })
    }
    createPokemon(): Observable<boolean> {
        return new Observable((obs) => {
            this.getPokemonTypeGrass().subscribe((result: PokemonEntity) => {
                this.validateByduplicatedata(result).subscribe((duplicate: boolean) => {
                    if (!duplicate) {
                        this.onCreate(result).subscribe((newPokemon: PokemonEntity) => {
                            console.log(newPokemon);
                            obs.next(true)
                        })
                    } else {
                        // console.log("duplicate ==> ", result.name);
                        obs.next(false)
                    }
                })
            }, (error: any) => {
                console.error(error)
                obs.next(false)
            })
        })

    }
}

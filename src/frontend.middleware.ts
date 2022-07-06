import { NestMiddleware, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from "express"
import { join, resolve } from 'path'

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  constructor(
    private config: ConfigService
  ) { }

  use(_req: Request, res: Response, next: Function) {
    const path = join(__dirname, this.config.getOrThrow('SITE_DIR'))

    res.sendFile(resolve(path + '/index.html'))
  }
}
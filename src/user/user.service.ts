import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { randomString } from '../utils/random';
import { UserEntity, UserStatusEntity } from './entities/user.entity';
import { INewUser, IUser, IUserCode, IUserStatus } from './types/user.type';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) { }

    async findByEmail(email: string): Promise<IUser|null> {
        const entity = await this.repository.findOne({
            where: {
                email
            },
        })

        if (entity == null) {
            return null
        }
  


        return this.mapEntityToModel(entity)
    }

    async validateNickname(nickname: string): Promise<boolean> {
        const entity = await this.repository.findOne({
            where: {
                nickname
            },
        })

        return (entity == null)
    }

    async create(newUser: INewUser): Promise<IUser & IUserCode> {
        const foundUser = await this.findByEmail(newUser.email)
        if (foundUser != null) {
            throw new Error("User is already existed")
        }

        const code = null //randomString(24)
        const entity = await this.repository.save<DeepPartial<UserEntity>>({
            email: newUser.email,
            password: newUser.password,
            nickname: newUser.nickname,
            status: UserStatusEntity.ACTIVE,
            code: code
        })

        return {
            ...this.mapEntityToModel(entity),
            code
        }
    }

    async confirm(code: string): Promise<IUser> {
        const user = await this.repository.findOne({
            where: {
                code: code,
                status: UserStatusEntity.WAIT_CONFIRM,
            }
        })
       
        if (user == null) {
            throw new Error("User not found")
        }

        
        const entity = await this.repository.save<DeepPartial<UserEntity>>({
            status: UserStatusEntity.ACTIVE,
            code: ""
        })

        return this.mapEntityToModel(entity)
    }

    async findOne(id: number): Promise<IUser> {
        const entity = await this.repository.findOne({
            where: {
                id
            },
            relations: ["wallets"],
        })

        if (entity == null) {
            throw new Error("User is not found")
        }

        return this.mapEntityToModel(entity)
    }

    private mapEntityToModel(entity: UserEntity): IUser {
        return {
            ...entity,
            status: this.mapStatus(entity.status)
        }
    }

    private mapStatus(entity: UserStatusEntity): IUserStatus {
        switch (entity) {
            case UserStatusEntity.ACTIVE: return IUserStatus.ACTIVE
            case UserStatusEntity.BLOCKED: return IUserStatus.BLOCKED
            case UserStatusEntity.WAIT_CONFIRM: return IUserStatus.WAIT_CONFIRM   
        }
    }
    
}

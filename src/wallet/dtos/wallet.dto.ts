import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, Length } from "class-validator"

export class WalletResponseDto {
  @ApiProperty({
    description: 'ID кошелька'
  })
  id: number

  @ApiProperty({
    description: 'Название'
  })
  name: string
  @ApiProperty({
    description: 'Адрес'
  })
  address: string

  @ApiProperty({
    description: 'Баланс'
  })
  balance: number | null

  @ApiProperty({
    description: 'По-умолчанию'
  })
  isDefault: boolean
}

export class UpdateWalletRequestDto {
  @ApiProperty({
    required: true,
    description: 'Название кошелька'
  })
  @IsNotEmpty()
  @Length(3, 50)
  name: string
}
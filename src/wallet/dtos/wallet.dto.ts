import { ApiProperty } from "@nestjs/swagger"

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
}
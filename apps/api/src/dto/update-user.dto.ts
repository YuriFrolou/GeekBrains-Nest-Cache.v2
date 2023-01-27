import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {

  @ValidateIf(o=>o.firstName)
  @IsString()
  @MinLength(2)
  firstName?: string;


  @ValidateIf(o=>o.lastName)
  @IsString()
  @MinLength(2)
  lastName?: string;


  @ValidateIf(o=>o.email)
  @IsEmail()
  email?: string;


  @ValidateIf(o=>o.password)
  @IsString()
  password?: string;


  @ValidateIf(o=>o.cover)
  @ApiPropertyOptional({type:String})
  @IsString()
  @IsOptional()
  cover?: string;

}

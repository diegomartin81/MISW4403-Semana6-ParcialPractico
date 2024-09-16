import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class AerolineaDto {

 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly descripcion: string;
 
 @IsDate()
 @IsNotEmpty()
 @Type(() => Date)
 readonly fechaFundacion: Date;
 
 @IsString()
 @IsNotEmpty()
 readonly paginaWeb: string;
 
}
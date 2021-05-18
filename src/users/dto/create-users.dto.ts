export class CreateUserDto {
  readonly name: string;
  readonly lastname: string;
  readonly email: string;
  password: string;
  repassword: string;
}

import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
export class User {

  @PrimaryGeneratedColumn() id: number;

  @Column()
  login: string;

  @Column({ default: "user" })
  role: string;

  @Column({
    name: "password"
  })
  private passwordColumn: string;

  set password(password: string) {
    this.passwordColumn = bcrypt.hashSync(
      password.trim(),
      bcrypt.genSaltSync(10)
    );
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordColumn);
  }
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  Unique,
} from 'typeorm';

@Entity()
@Unique('email', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  afterInsertHook() {
    console.log('Inserted new user', this.id);
  }
}

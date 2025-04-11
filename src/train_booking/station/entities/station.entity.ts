import { Route } from 'src/train_booking/route/entities/route.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Station {
  @PrimaryGeneratedColumn()
  stationId: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ default: true })
  active: boolean;

  // 
  @OneToMany(()=> Route, (route)=> route.departureStation)
  routeDepartingStaion:Route[];
  
  // 
  @OneToMany(()=> Route, (route)=> route.arrivalStation)
  routeDepartingStaions:Route[];


}

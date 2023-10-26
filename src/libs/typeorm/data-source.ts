import { DataSource } from 'typeorm';
import { entities } from './entities';
import { migrations } from './migrations';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities,
  migrations,
  synchronize: true,
});

// const dataSource = new DataSource({
//   type: 'postgres',
//   host: 'dpg-cktauuo168ec73ca1gt0-a',
//   port: 5432,
//   username: 'postgres1',
//   password: 'LJM0NT0qZa1ojK5mLXmCI1y7Aud6u2J1',
//   database: 'tattoo_0pro',
//   entities,
//   migrations,
//   synchronize: true,
// });

export default dataSource;

import { NextResponse } from 'next/server';
import knexConfig from "@/../knexfile.js"
import { RepositoryAsyncV1 } from '@/core/repository/RepositoryAsyncV1';
import { Address } from '@/models/Address';
import { User } from '@/models/User';
import knex0 from "knex";

const knex = knex0(knexConfig["development"]);

export async function GET() {
    
    // let AddresseRepo = new RepositoryAsync<Address>("Addresses");
    // let myAddresse = new Address();
    // myAddresse.address = "miranda 20";
    // myAddresse.city = "funchal";
    // myAddresse.postal_code = "9020-099"
    // // myAddresse.id = 1;

      const userRepo = new RepositoryAsyncV1<User>("Users");
      const user = new User();
      user.id = 7;
    // user.Address = myAddresse;
    // user.email = "tania@gmail.com"
    // user.name = "tt";
    // user.phone_number= "925678026"
    // // user.id = 1

    // console.log( user = await userRepo.create(user) );

    // user.phone_number= "925678030"
    // console.log( await userRepo.update(user) );
   // console.log( await userRepo.delete(user) )
   // console.log( await userRepo.deleteRangeByPrimaryKeys([1,2,3,4,6,8]) )
   
    //console.log( await userRepo.deleteByCondition([{key:"id",op:"=",value:13},{key:"name",op:"=",value:"tt"}]) )

    //console.log( await userRepo.getByCondition([{key:"Users.id",op:">",value:20}],["Address"],[{column: "Users.id", order:"desc"}],2))

    //console.log( await userRepo.getFirstByCondition([{key:"Users.id",op:">",value:20}],["Address"],[{column: "Users.id", order:"desc"}],2))

    //console.log( await userRepo.getByPrimaryKey([{name:"Users.id",value:20}],["Address"]))

  return NextResponse.json({h:"hello world"});
}
import { NextResponse } from 'next/server';
import knexConfig from "@/../knexfile.js"
import { RepositoryAsync } from '@/core/Repository/RepositoryAsync';
import { Addresse } from '@/models/Address';
import { User } from '@/models/User';
const knex = require('knex')(knexConfig["development"]);

export async function GET() {
    
    // let AddresseRepo = new RepositoryAsync<Addresse>("Addresses");
    // let myAddresse = new Addresse();
    // myAddresse.address = "miranda 20";
    // myAddresse.city = "funchal";
    // myAddresse.postal_code = "9020-099"
    // // myAddresse.id = 1;

      let userRepo = new RepositoryAsync<User>("Users");
      let user = new User();
      user.id = 7;
    // user.Addresse = myAddresse;
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

    //console.log( await userRepo.getByCondition([{key:"Users.id",op:">",value:20}],["Addresse"],[{column: "Users.id", order:"desc"}],2))

    //console.log( await userRepo.getFirstByCondition([{key:"Users.id",op:">",value:20}],["Addresse"],[{column: "Users.id", order:"desc"}],2))

    //console.log( await userRepo.getByPrimaryKey([{name:"Users.id",value:20}],["Addresse"]))

  return NextResponse.json({h:"hello world"});
}
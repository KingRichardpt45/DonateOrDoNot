import {NextResponse} from 'next/server';
import {IncludeNavigation} from '@/core/repository/IncludeNavigation';
import {CampaignManagerManager} from '@/core/managers/CampaignManagerManager';
import {Constraint} from '@/core/repository/Constraint';
import {Operator} from '@/core/repository/Operator';
import {UserRoleTypes} from '@/models/types/UserRoleTypes';


export async function GET() {
// let AddresseRepo = new RepositoryAsync<Address>("Address");
    //const UserRepo = new RepositoryAsync(User);
    // const myAddresse = new Address();

    // myAddresse.address = "Santo antónio Caminho da miranda";
    // myAddresse.city = "funchal"
    // myAddresse.specification = "29"
    // myAddresse.postal_code = "9020-098"

    // const notification = new Notification();
    // notification.campaign_id = 0;
    // notification.message = "teste1";
    // const notification2 = new Notification();
    // notification2.campaign_id = 0;
    // notification2.message = "teste2";

    // //create
    // const user = new User();
    // user.address.value = myAddresse;
    // user.email = "test@test.com";
    // user.first_name = "ricardo";
    // user.middle_names = "F. C.";
    // user.last_name = "Vieira";
    // user.notifications.value = [];
    // user.notifications.value.push(notification);
    // user.notifications.value.push(notification2);

    //let result = await UserRepo.create(user);


    // gets without includes
    //console.log( await AddresseRepo.create(myAddresse) );
    // let result = await AddresseRepo.getAll([],[{column: "id", order:"desc"}],2,1);
    // let result = await AddresseRepo.getByPrimaryKey([ new PrimaryKeyPart("id", 1 ) ],[]);
    // let result = await AddresseRepo.getByCondition([ new Constraint("id","!=","2")],[],[],2,1);
    // let result = await AddresseRepo.getByCondition([ new Constraint("address","like","% da %")],[],[],2,0);
    // let result = await AddresseRepo.getFirstByCondition([new Constraint("address","like","% da %")],[],[],2,0);

    // gets with includes
    //let result = await UserRepo.getAll((user)=> [ new IncludeNavigation( user.notifications , 0), new IncludeNavigation( user.address , 0) ]);
    //const result = await UserRepo.getByPrimaryKey([ new PrimaryKeyPart("id", 1 ) ],(user)=>[new IncludeNavigation(user.notifications,0)]);
    //const result = await UserRepo.getFirstByCondition([new Constraint("Addresses.id", "=", "18")], (user) => [new IncludeNavigation(user.address, 0)], [], 0, 0);
    // let result = await AddresseRepo.getByCondition([ new Constraint("address","like","% da %")],[],[],2,0);
    // let result = await AddresseRepo.getFirstByCondition([new Constraint("address","like","% da %")],[],[],2,0);

    // updates
    // user.id = 25;
    // user.address_id = 32
    // user.email = "test2@test.coms";
    // user.first_name = "ricardo3s";
    // user.middle_names = "F. C. 4";
    // user.last_name = "Vieirass";
    //let result = await UserRepo.update(user);
    //let result = await UserRepo.updateExcluding(user,"address_id");
    //let result = await UserRepo.updateFields(user,"address_id");


    // deletes
    // let result1 = await UserRepo.delete(user);
    // let a1 = new Address()
    // a1.id = 50;
    // let a2 = new Address()
    // a2.id = 49;
    // let result2 = await AddresseRepo.deleteRange([a1,a2]);

    // let notificationrepo = new RepositoryAsync<Notification>("Notification");
    // let result3 = await notificationrepo.deleteByCondition([new Constraint("user_id",">=",24)]);

    // let result4 = await notificationrepo.deleteRangeByPrimaryKeys( [ new PrimaryKeyPart("id",18) ], [new PrimaryKeyPart("id",19)] );


    // myAddresse.address = "miranda 20";
    // myAddresse.city = "funchal";
    // myAddresse.postal_code = "9020-099"
    // // myAddresse.id = 1;

    // let userRepo = new RepositoryAsyncV1<User>("Users");
    // let user = new User();
    // user.id = 7;
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

    const UnverifiedManagers = await (new CampaignManagerManager).getByCondition(
        [new Constraint("verified", Operator.EQUALS, false), new Constraint("Users.type", Operator.EQUALS, UserRoleTypes.CampaignManager)], (manager) => [new IncludeNavigation(manager.user, 0)]
    );

    return NextResponse.json({h: "hello world", a: UnverifiedManagers});
}


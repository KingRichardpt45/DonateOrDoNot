import { BankAccount } from "@/models/BankAccount";
import { EntityManager } from "./EntityManager";

export class BankAccountManager extends EntityManager<BankAccount>
{
    constructor()
    {
        super(BankAccount);
    }

    async create( iban:string, accountHolder:string, bankName:string ) : Promise<BankAccount>
    {
        const account = new BankAccount();
        account.iban = iban;
        account.bank_name = bankName;
        account.account_holder = accountHolder;

        return this.repository.create(account);
    }

}
import {FormObjectValidator} from "@/core/utils/FormObjectValidator";
import {NextRequest, NextResponse} from "next/server";
import {EntityManager} from "@/core/managers/EntityManager";
import {BankAccount} from "@/models/BankAccount";

const bankAccountManager = new EntityManager<BankAccount>(BankAccount);
const formValidator = new FormObjectValidator("iban", "account_holder", "bank_name");

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const errors = formValidator.validateFormParams(formData);
    if (errors.length > 0)
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});

    const bankAccount = new BankAccount()

    bankAccount.iban = formData.get("iban")?.toString().trim() || null;
    bankAccount.account_holder = formData.get("account_holder")?.toString().trim() || null;
    bankAccount.bank_name = formData.get("bank_name")?.toString().trim() || null;

    const createdBankAccount = await bankAccountManager.create(bankAccount);

    if (createdBankAccount == null)
        return NextResponse.json({}, {status: 404, statusText: "Error creating bank account."});

    return NextResponse.json({data: createdBankAccount}, {status: 200, statusText: "Success."});
}

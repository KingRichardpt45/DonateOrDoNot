import { FileManager } from "@/core/managers/FileManager";
import { FormObjectValidator } from "@/core/utils/FormObjectValidator";
import fs from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";

const fileManager = new FileManager();
const formValidator = new FormObjectValidator("id");
const savePath = "./public/documents/";

export async function POST( request : NextRequest )
{
    const formData = await request.formData();

    const errors = formValidator.validate(formData);
    if( errors.length > 0 )
        return NextResponse.json({errors}, {status: 400, statusText: "Invalid form fields."});

    const fileId = formData.get("id")!.valueOf() as number;
    const file = await fileManager.getById( fileId );

    if(file == null)
        return NextResponse.json({},{status:404,statusText:"File not found."});

    const byteArray = await fs.readFile(`${savePath}${file.id}`);

    return NextResponse.json({file,content: Array.from(byteArray) },{status:200,statusText:"Success."});
}
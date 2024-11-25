export class YupUtils
{
    static convertToNumber( value : any): number | null
    {
        return value || value == 0 ? Number(value) : null;
    }
}
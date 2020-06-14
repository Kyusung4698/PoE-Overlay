export class EnumValues {
    public keys: number[];
    public values: {
        [key: string]: any
    };

    constructor(enumObject: any) {
        this.keys = Object.keys(enumObject).filter(x => !isNaN(Number(x))).map(Number);
        this.values = enumObject;
    }
}




export class Predicate {
    public statements: string[];
    public values: any[];

    constructor() {
        this.statements = [];
        this.values = [];
    }


    public greaterThan(field: string, value: any): void {
        this.statements.push(field + "> ?");
        this.values.push(value);
    }

    public lessThan(field: string, value: any): void {
        this.statements.push(field + "< ?");
        this.values.push(value);
    }

    public equalTo(field: string, value: any): void {
        this.statements.push(field + "= ?");
        this.values.push(value);
    }
}
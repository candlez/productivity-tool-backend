


export abstract class Predicate {
    public statements: string[];
    public values: any[];

    constructor() {
        this.statements = [];
        this.values = [];
    }

    public equalTo(field: string, value: any): void {
        this.statements.push(field + "= ?");
        this.values.push(value);
    }
}

export class WherePredicate extends Predicate {
    constructor() {
        super();
    }

    public greaterThan(field: string, value: any): void {
        this.statements.push(field + "> ?");
        this.values.push(value);
    }

    public lessThan(field: string, value: any): void {
        this.statements.push(field + "< ?");
        this.values.push(value);
    }
}

export class UpdatePredicate extends Predicate {
    constructor() {
        super();
    }
}
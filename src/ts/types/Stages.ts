import Stage1 from "assets/Stage1.png";
import Stage2 from "assets/Stage2.png";
import Stage3 from "assets/Stage3.png";
import Stage4 from "assets/Stage4.png";
import Stage5 from "assets/Stage5.png";

export class Stages {
    static readonly Stage1 = Stage1;
    static readonly Stage2 = Stage2;
    static readonly Stage3 = Stage3;
    static readonly Stage4 = Stage4;
    static readonly Stage5 = Stage5;

    private constructor(
        private readonly key: string,
        public readonly value: any
    ) {}

    toString() {
        return this.key;
    }
}

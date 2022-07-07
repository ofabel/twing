import {TwingNode} from "../node";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

export const type = new TwingNodeType('if');

export class TwingNodeIf extends TwingNode {
    constructor(tests: TwingNode, elseNode: TwingNode, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('tests', tests);

        if (elseNode) {
            nodes.set('else', elseNode);
        }

        super(nodes, new Map(), lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        let count = this.getNode('tests').getNodes().size;

        for (let i = 0; i < count; i += 2) {
            if (i > 0) {
                compiler
                    .outdent()
                    .write('}\n')
                    .write('else if (this.evaluate(')
                ;
            } else {
                compiler
                    .write('if (this.evaluate(')
                ;
            }

            compiler
                .subcompile(this.getNode('tests').getNode(i))
                .raw(")) {\n")
                .indent()
                .subcompile(this.getNode('tests').getNode(i + 1))
            ;
        }

        if (this.hasNode('else')) {
            compiler
                .outdent()
                .write("}\n")
                .write("else {\n")
                .indent()
                .subcompile(this.getNode('else'))
            ;
        }

        compiler
            .outdent()
            .write("}\n");
    }
}

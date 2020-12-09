import * as fs from 'fs';

enum Op {
  Nop = 'NOP',
  Acc = 'ACC',
  Jmp = 'JMP'
}

interface ExecutionResult {
  programCounter: number;
  acc: number;
}

class Instruction {
  op: Op;
  private param: number;
  private executionCount = 0;

  private setOpFromString(op: string) {
    switch (op) {
      case 'nop':
        this.op = Op.Nop;
        break;
      case 'acc':
        this.op = Op.Acc;
        break;
      case 'jmp':
        this.op = Op.Jmp;
        break;
      default:
        throw new Error(`Unexpected instruction: ${op}`);
    }
  }

  constructor(line: string) {
    const matches = line.match(/(.{3}) ((\+|-)\d+)/);
    this.setOpFromString(matches[1]);
    this.param = Number.parseInt(matches[2]);
  }

  private executeNoOp(programCounter: number, acc: number): ExecutionResult {
    return {
      programCounter: ++programCounter,
      acc
    };
  }

  private executeAcc(programCounter: number, acc: number): ExecutionResult {
    return {
      acc: acc + this.param,
      programCounter: ++programCounter
    };
  }

  private executeJmp(programCounter: number, acc: number): ExecutionResult {
    return {
      programCounter: programCounter + this.param,
      acc
    }
  }

  public execute(programCounter: number, acc: number): ExecutionResult {
    this.executionCount++;
    switch (this.op) {
      case Op.Nop:
        return this.executeNoOp(programCounter, acc);
      case Op.Acc:
        return this.executeAcc(programCounter, acc);
      case Op.Jmp:
        return this.executeJmp(programCounter, acc);
      default:
        throw new Error(`Unexpected op ${this.op}`);
    }
  }

  public getExecutionCount(): number {
    return this.executionCount;
  }
}

class Executor {
  private instructions: Instruction[];
  private programCounter = 0;
  private acc = 0;

  constructor(instructs: Instruction[]) {
    this.instructions = instructs;
  }

  private alteredInstructionIndex = -1;
  private alteredInstructionOp = Op.Nop;

  private alterInstruction() {
    // find next jmp/nop instruction to alter
    let newIndex = this.alteredInstructionIndex + 1;
    let nextOpToAlter = this.instructions[newIndex]
    while (nextOpToAlter.op === Op.Acc) {
      newIndex++;
      nextOpToAlter = this.instructions[newIndex]
    }

    // restore old altered op
    if (this.alteredInstructionIndex > -1) {
      this.instructions[this.alteredInstructionIndex].op = this.alteredInstructionOp;
    }

    // alter new op
    this.alteredInstructionOp = nextOpToAlter.op
    this.alteredInstructionIndex = newIndex;
    nextOpToAlter.op = nextOpToAlter.op === Op.Nop ? Op.Jmp : Op.Nop;
    this.instructions[this.alteredInstructionIndex] = nextOpToAlter;
  }

  getCurrentInstruction(): Instruction {
    if (this.programCounter >= this.instructions.length) {
      return undefined;
    }

    return this.instructions[this.programCounter];
  }

  resetOnLoopDetected(): void {
    this.alterInstruction();
    this.programCounter = 0;
    this.acc = 0;
  }

  runPart1(): void {
    while (true) {
      const inst = this.getCurrentInstruction();
      const result = inst.execute(this.programCounter, this.acc);
      if (inst.getExecutionCount() === 2) {
        console.log(`Part 1 result: ${this.acc}`);
        return;
      } else {
        this.acc = result.acc;
        this.programCounter = result.programCounter;
      }
    }
  }

  runPart2(): void {
    while (true) {
      const inst = this.getCurrentInstruction();

      if (!inst) {
        console.log(`Part 2 result: ${this.acc}`);
        return;
      }

      const result = inst.execute(this.programCounter, this.acc);
      if (inst.getExecutionCount() === 2) {
        this.resetOnLoopDetected();
      } else {
        this.acc = result.acc;
        this.programCounter = result.programCounter;
      }
    }
  }
}

(async () => {
  const fileName = 'input.txt';
  const file: string = await fs.promises.readFile(__dirname + '/' + fileName, 'utf8');
  const lines = file.split('\r\n');

  const instructions = lines.map(line => new Instruction(line));
  const executor = new Executor(instructions);

  executor.runPart1();
  executor.runPart2();
})();
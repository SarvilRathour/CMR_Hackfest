const { Command } = require("commander");
const fs = require("fs");
const crypto = require("crypto");

const program = new Command();
const CHAIN_FILE = "QC.json";

/* ---------------- BLOCK ---------------- */

class Block {
  constructor(index, timestamp, payload, previous_hash) {
    this.index = index;
    this.timestamp = timestamp;
    this.payload = payload;
    this.previous_hash = previous_hash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const data =
      this.index +
      this.timestamp +
      JSON.stringify(this.payload) +
      this.previous_hash;

    return crypto.createHash("sha256").update(data).digest("hex");
  }
}
class Blockchain {
  constructor() {
    this.chain = this.loadChain();
  }

  loadChain() {
    if (fs.existsSync(CHAIN_FILE)) {
      return JSON.parse(fs.readFileSync(CHAIN_FILE));
    }
    return [];
  }

  saveChain() {
    fs.writeFileSync(CHAIN_FILE, JSON.stringify(this.chain, null, 2));
  }

  genesisExists() {
    return this.chain.length > 0;
  }

  createGenesisBlock(contractor_name, issued_date, expected_finishing_date, budget) {
    if (this.genesisExists()) {
      console.log(" Genesis block already exists");
      return;
    }

    const genesis = new Block(
      0,
      new Date().toISOString(),
      {
        contractor_name,
        issued_date,
        expected_finishing_date,
        budget,
        created_by: "GOVERNMENT",
      },
      "0"
    );

    this.chain.push(genesis);
    this.saveChain();
    console.log("Genesis block created");
  }

  addBlock(payload) {
    if (!this.genesisExists()) {
      console.log("Create genesis block first");
      return;
    }

    const lastBlock = this.chain[this.chain.length - 1];

    const block = new Block(
      lastBlock.index + 1,
      new Date().toISOString(),
      payload,
      lastBlock.hash
    );

    this.chain.push(block);
    this.saveChain();
    console.log("✅ Block added");
  }

  validateChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      const recalculatedHash = crypto
        .createHash("sha256")
        .update(
          current.index +
          current.timestamp +
          JSON.stringify(current.payload) +
          current.previous_hash
        )
        .digest("hex");

      if (current.hash !== recalculatedHash) {
        console.log(` Block ${current.index} has been tampered`);
        return;
      }

      if (current.previous_hash !== previous.hash) {
        console.log(`Invalid chain at block ${current.index}`);
        return;
      }
    }

    console.log("Blockchain is valid");
  }

  printChain() {
    console.log(JSON.stringify(this.chain, null, 2));
  }
}

const blockchain = new Blockchain();

program
  .name("immutable-qc")
  .description("Immutable QC Blockchain")
  .version("0.1.0");
  
program
  .command("genesis")
  .requiredOption("-c, --contractor <name>")
  .requiredOption("-i, --issued_date <date>")
  .requiredOption("-e, --expected_finishing_date <date>")
  .requiredOption("-b, --budget <amount>")
  .action((o) => {
    blockchain.createGenesisBlock(
      o.contractor,
      o.issued_date,
      o.expected_finishing_date,
      o.budget
    );
  });

program
  .command("add")
  .requiredOption("-m, --message <msg>")
  .action((o) => {
    blockchain.addBlock({
      message: o.message,
      added_by: "QC_OFFICER",
    });
  });

program
  .command("validate")
  .description("Validate blockchain integrity")
  .action(() => {
    blockchain.validateChain();
  });

/* Print */
program
  .command("print")
  .description("Print blockchain")
  .action(() => {
    blockchain.printChain();
  });

program.parse(process.argv);


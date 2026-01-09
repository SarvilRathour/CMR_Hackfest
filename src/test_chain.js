const {Command}=require("commander");
const fs=require("fs");
const crypto=require("crypto");
// Block{
//   index,
//   timestamp,
//   previous_hash,
//   block_type,
//   payload,
//   nonce,
//   hash
// }
const program=new Command();
const CHAIN_FILE = "blockchain.json";
const POW_POOL_FILE="pow_pool.json";
class Block{
  constructor(index, timestamp, type, payload, previousHash,nonce=0){
    this.index=index;
    this.timestamp=timestamp;
    this.block_type=type;
    this.payload=payload;
    this.previous_hash=previousHash;
    this.nonce=nonce;
    this.hash=this.calculateHash();
  }
  calculateHash(){
    const data=this.index+this.timestamp+this.block_type+JSON.stringify(this.payload)+this.previousHash+this.nonce;
    return crypto.createHash("sha256").update(data).digest("hex");
  }
  // mineBlock(){
  //   while(!this.hash.startsWith(DIFFICULTY)){
  //     this.nonce++;
  //     console.log(this.hash);
  //     this.hash=this.calculateHash();
  //   }
  // }
}
class Blockchain{
  constructor(){
    this.chain=this.loadChain();
  }
  loadChain(){
    if(fs.existsSync(CHAIN_FILE)){
      return JSON.parse(fs.readFileSync(CHAIN_FILE));
    }
    return [];
  }
  saveChain(){
    fs.writeFileSync(CHAIN_FILE,JSON.stringify(this.chain,null,2));
  }
  getLatestBlock(){
    return this.chain[this.chain.length-1];
  }
  getGenesisHash() {
    return this.chain[0]?.hash;
  }
  genesisExists() {
    return this.chain.length > 0;
  }

  createGenesisBlock(project,budget,details){
    if(this.chain.lengt>0){
      console.log("Genesis Block already exists");
      return;
    }
    const genesisBlock=new Block(
      0,
      new Date().toISOString(),
      "Genesis",
      {
        project,
        budget,
        details,
        created_by:"GOVERNMENT"
      },
      "0"
    );
    this.chain.push(genesisBlock);
    this.saveChain();
    console.log("Genesis created successfully");
  }
  addContractBlock(powWinner){
    const lastBlock=this.chain[this.chain.length-1];
    const block=new Block(
      lastBlock.index+1,
      new Date().toISOString(),
      "CONTRACTOR_POW",
      {
        contractor:powWinner.contractor,
        difficulty:powWinner.difficulty,
        pow_hash:powWinner.hash,
      },
      lastBlock.hash,
      powWinner.nonce
    );
    this.chain.push(block);
    this.saveChain();
  }
  addAcknowledgement(contractor){
    const last=this.chain[this.chain.length-1];
    if(last.block_type !== "CONTRACTOR_POW"){
      console.log("acknowledgement is not allowed");
      return;
    }
    if(last.payload.contractor!==contractor){
      console.log("Only selected contractor can acknowledge");
      return;
    }
    const block=new Block(
      last.index+1,
      new Date().toISOString(),
      "ACKNOWLEDGEMENT",
      {
        contractor,
        action:"WORK_STARTED",
      },
      last.hash
    );
    this.chain.push(block);
    this.saveChain();
  }
  addPhaseCompletion(contractor,phase){
    const ackExists=this.chain.some(
      (b)=>b.block_type==="ACKNOWLEDGEMENT"
    );
    if(!ackExists){
      console.log("Work not acknowedged yet");
      return;
    }
    const block=new Block(
      this.chain[this.chain.length-1].index+1,
      new Date().toISOString(),
      "PHASE_COMPLETED",
      {
        contractor,
        phase,
        proof:crypto.randomBytes(8).toString("hex"),
      },
      this.chain[this.chain.length-1].hash
    );
    this.chain.push(block);
    this.saveChain();
  }
  printChain(){
    console.log(JSON.stringify(this.chain,null,2));
  }
}
// PoWSubmission {
//   contractor,
//   timestamp,
//   nonce,
//   hash,
//   difficulty,
//   target_hash   // genesis hash
// }
class PoWPool{
  constructor(){
    this.pool=this.load();
  }
  load(){
    if(fs.existsSync(POW_POOL_FILE)){
      return JSON.parse(fs.readFileSync(POW_POOL_FILE));
    }
    return[];
  }
  save(){
    fs.writeFileSync(POW_POOL_FILE,JSON.stringify(this.pool,null,2));
  }
  mineSubmission(contractor,targetHash,difficulty){
    console.log("Mining POW block");
    let nonce=0;
    let hash="";
    do{
      const data=contractor+targetHash+nonce;
      hash = crypto.createHash("sha256").update(data).digest("hex");
      nonce++;
    }while(!hash.startsWith("0".repeat(difficulty)));
    const submission={
      contractor,
      timestamp:new Date().toISOString(),
      nonce,
      hash,
      difficulty,
      target_hash:targetHash,
    }
    this.pool.push(submission);
    this.save();
  }
  pickWinner(){
    if(this.pool.length===0){
      console.log("No Pow submission");
      return null;
    }
    const randomIndex=Math.floor(Math.random() * this.pool.length);
    const winner=this.pool[randomIndex];
    return winner;
  }
   printPool() {
    console.log(JSON.stringify(this.pool, null, 2));
  }
}
const blockchain=new Blockchain();
const powPool = new PoWPool();

program
  .name("tender-chain")
  .description("Blockchain-based tender system (CLI prototype)")
  .version("0.1.0");

program
  .command("genesis")
  .description("Create genesis block (government tender)")
  .requiredOption("-p, --project <name>", "Project name")
  .requiredOption("-b, --budget <amount>", "Project budget")
  .requiredOption("-d, --details <details>", "Project details")
  .action((options) => {
  blockchain.createGenesisBlock(
      options.project,
      options.budget,
      options.details
    );
  });
 program
  .command("pow")
  .requiredOption("-c, --contractor <name>")
  .option("-d, --difficulty <n>", "PoW difficulty", "4")
  .action((opts) => {
    if (!blockchain.genesisExists()) {
      console.log("Genesis block not found");
      return;
    }
    powPool.mineSubmission(
      opts.contractor,
      blockchain.getGenesisHash(),
      parseInt(opts.difficulty)
    );
  });
  program
  .command("select-winner")
  .description("Random lottery selection")
  .action(() => {
    const winner = powPool.pickWinner();
    console.log(winner);
    if (!winner) return;

    blockchain.addContractBlock(winner);
    // powPool.clear();
  });
program
  .command("print-chain")
  .action(() => blockchain.printChain());

program
  .command("print-pow")
  .action(() => powPool.printPool());
program
  .command("ack")
  .requiredOption("-c, --contractor <name>")
  .action((o) => blockchain.addAcknowledgement(o.contractor));
program
  .command("complete-phase")
  .requiredOption("-c, --contractor <name>")
  .requiredOption("-p, --phase <phase>")
  .action((o) => blockchain.addPhaseCompletion(o.contractor, o.phase));
program.parse(process.argv);


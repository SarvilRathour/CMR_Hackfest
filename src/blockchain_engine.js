/* src/blockchain_engine.js */

// Load Crypto Library dynamically if it is missing
if (typeof CryptoJS === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    document.head.appendChild(script);
}

class Block {
    constructor(index, timestamp, type, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.type = type; // Types: 'TENDER', 'EVIDENCE', 'VOTE'
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return CryptoJS.SHA256(
            this.index + 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.data) + 
            this.nonce
        ).toString();
    }

    mineBlock(difficulty = 2) {
        // Simple Proof-of-Work simulation
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

const GovChain = {
    // 1. Retrieve the Chain from LocalStorage
    getChain: function() {
        const chain = localStorage.getItem('gov_ledger');
        if (!chain) {
            const genesis = new Block(0, new Date().toISOString(), "GENESIS", "System Initialization", "0");
            localStorage.setItem('gov_ledger', JSON.stringify([genesis]));
            return [genesis];
        }
        return JSON.parse(chain);
    },

    // 2. Add Data to the Chain (Mine new block)
    addData: function(type, data) {
        const chain = this.getChain();
        const latestBlock = chain[chain.length - 1];

        const newBlock = new Block(
            chain.length,
            new Date().toISOString(),
            type,
            data,
            latestBlock.hash
        );

        // Simulate mining delay
        newBlock.mineBlock(); 
        
        chain.push(newBlock);
        localStorage.setItem('gov_ledger', JSON.stringify(chain));
        
        console.log(`Block #${newBlock.index} Mined: ${newBlock.hash}`);
        return newBlock;
    },

    // 3. Helper: View Raw Blockchain Data
    viewLedger: function() {
        const chain = this.getChain();
        const win = window.open("", "Blockchain Ledger", "width=800,height=600");
        win.document.write(`
            <style>
                body { font-family: 'Courier New', monospace; background: #1e1e1e; color: #00ff00; padding: 20px; white-space: pre-wrap; }
                h1 { border-bottom: 1px solid #333; padding-bottom: 10px; }
            </style>
            <h1>GOV-CHAIN IMMUTABLE LEDGER</h1>
            <p>Total Blocks Mined: ${chain.length}</p>
            <pre>${JSON.stringify(chain, null, 4)}</pre>
        `);
    },

    // 4. Helper: Retrieve all Tenders
    getAllTenders: function() {
        return this.getChain()
            .filter(block => block.type === 'TENDER')
            .map(b => b.data);
    }
};
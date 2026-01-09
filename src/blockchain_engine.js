/* src/blockchain_engine.js */

// Load Crypto Library dynamically if not present
if (typeof CryptoJS === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    document.head.appendChild(script);
}

class Block {
    constructor(index, timestamp, type, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.type = type; // 'TENDER_UPLOAD', 'VOTE', 'AUDIT'
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        // SHA-256 Hashing for immutability
        return CryptoJS.SHA256(
            this.index + 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.data) + 
            this.nonce
        ).toString();
    }

    mineBlock(difficulty = 2) {
        // Simple Proof-of-Work simulation (makes it look real)
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

const GovChain = {
    getChain: function() {
        const chain = localStorage.getItem('gov_ledger');
        return chain ? JSON.parse(chain) : [this.createGenesisBlock()];
    },

    createGenesisBlock: function() {
        return new Block(0, new Date().toISOString(), "GENESIS", "System Init", "0");
    },

    // CORE FUNCTION: Upload Data "On-Chain"
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

        // Simulate Mining
        newBlock.mineBlock();

        // Save to Immutable Ledger
        chain.push(newBlock);
        localStorage.setItem('gov_ledger', JSON.stringify(chain));
        
        console.log(`Block #${newBlock.index} Mined: ${newBlock.hash}`);
        return newBlock;
    },

    // Helper: Get all Tenders from the Chain
    getAllTenders: function() {
        const chain = this.getChain();
        // Filter blocks where type is 'TENDER_UPLOAD'
        return chain.filter(block => block.type === 'TENDER_UPLOAD').map(b => b.data);
    }
};
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StableSwap = void 0;
var bn_js_1 = __importDefault(require("bn.js"));
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var constants_1 = require("./constants");
var fees_1 = require("./fees");
var instructions = __importStar(require("./instructions"));
var layout = __importStar(require("./layout"));
var account_1 = require("./util/account");
var calculator_1 = require("./util/calculator");
var send_and_confirm_transaction_1 = require("./util/send-and-confirm-transaction");
var u64_1 = require("./util/u64");
/**
 * A program to exchange tokens against a pool of liquidity
 */
var StableSwap = /** @class */ (function () {
    /**
     * Constructor for new StableSwap client object
     * @param connection
     * @param stableSwap
     * @param swapProgramId
     * @param tokenProgramId
     * @param poolTokenMint
     * @param authority
     * @param adminAccount
     * @param adminFeeAccountA
     * @param adminFeeAccountB
     * @param tokenAccountA
     * @param tokenAccountB
     * @param mintA
     * @param mintB
     * @param initialAmpFactor
     * @param targetAmpFactor
     * @param startRampTimestamp
     * @param stopRampTimeStamp
     * @param fees
     */
    function StableSwap(connection, stableSwap, swapProgramId, tokenProgramId, poolTokenMint, authority, adminAccount, adminFeeAccountA, adminFeeAccountB, tokenAccountA, tokenAccountB, mintA, mintB, initialAmpFactor, targetAmpFactor, startRampTimestamp, stopRampTimeStamp, fees) {
        if (fees === void 0) { fees = fees_1.DEFAULT_FEES; }
        this.connection = connection;
        this.stableSwap = stableSwap;
        this.swapProgramId = swapProgramId;
        this.tokenProgramId = tokenProgramId;
        this.poolTokenMint = poolTokenMint;
        this.authority = authority;
        this.adminAccount = adminAccount;
        this.adminFeeAccountA = adminFeeAccountA;
        this.adminFeeAccountB = adminFeeAccountB;
        this.tokenAccountA = tokenAccountA;
        this.tokenAccountB = tokenAccountB;
        this.mintA = mintA;
        this.mintB = mintB;
        this.initialAmpFactor = initialAmpFactor;
        this.targetAmpFactor = targetAmpFactor;
        this.startRampTimestamp = startRampTimestamp;
        this.stopRampTimestamp = stopRampTimeStamp;
        this.fees = fees;
    }
    /**
     * Get the minimum balance for the token swap account to be rent exempt
     *
     * @return Number of lamports required
     */
    StableSwap.getMinBalanceRentForExemptStableSwap = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connection.getMinimumBalanceForRentExemption(layout.StableSwapLayout.span)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Load an onchain StableSwap program
     * @param connection The connection to use
     * @param address The public key of the account to load
     * @param programId Address of the onchain StableSwap program
     * @param payer Pays for the transaction
     */
    StableSwap.loadStableSwap = function (connection, address, programId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, stableSwapData, _a, authority, adminAccount, adminFeeAccountA, adminFeeAccountB, tokenAccountA, tokenAccountB, poolTokenMint, mintA, mintB, tokenProgramId, initialAmpFactor, targetAmpFactor, startRampTimestamp, stopRampTimeStamp, fees;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, account_1.loadAccount(connection, address, programId)];
                    case 1:
                        data = _b.sent();
                        stableSwapData = layout.StableSwapLayout.decode(data);
                        if (!stableSwapData.isInitialized) {
                            throw new Error("Invalid token swap state");
                        }
                        return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([address.toBuffer()], programId)];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 1]), authority = _a[0];
                        adminAccount = new web3_js_1.PublicKey(stableSwapData.adminAccount);
                        adminFeeAccountA = new web3_js_1.PublicKey(stableSwapData.adminFeeAccountA);
                        adminFeeAccountB = new web3_js_1.PublicKey(stableSwapData.adminFeeAccountB);
                        tokenAccountA = new web3_js_1.PublicKey(stableSwapData.tokenAccountA);
                        tokenAccountB = new web3_js_1.PublicKey(stableSwapData.tokenAccountB);
                        poolTokenMint = new web3_js_1.PublicKey(stableSwapData.tokenPool);
                        mintA = new web3_js_1.PublicKey(stableSwapData.mintA);
                        mintB = new web3_js_1.PublicKey(stableSwapData.mintB);
                        tokenProgramId = constants_1.TOKEN_PROGRAM_ID;
                        initialAmpFactor = stableSwapData.initialAmpFactor;
                        targetAmpFactor = stableSwapData.targetAmpFactor;
                        startRampTimestamp = stableSwapData.startRampTs;
                        stopRampTimeStamp = stableSwapData.stopRampTs;
                        fees = {
                            adminTradeFeeNumerator: stableSwapData.adminTradeFeeNumerator,
                            adminTradeFeeDenominator: stableSwapData.adminTradeFeeDenominator,
                            adminWithdrawFeeNumerator: stableSwapData.adminWithdrawFeeNumerator,
                            adminWithdrawFeeDenominator: stableSwapData.adminWithdrawFeeDenominator,
                            tradeFeeNumerator: stableSwapData.tradeFeeNumerator,
                            tradeFeeDenominator: stableSwapData.tradeFeeDenominator,
                            withdrawFeeNumerator: stableSwapData.withdrawFeeNumerator,
                            withdrawFeeDenominator: stableSwapData.withdrawFeeDenominator,
                        };
                        return [2 /*return*/, new StableSwap(connection, address, programId, tokenProgramId, poolTokenMint, authority, adminAccount, adminFeeAccountA, adminFeeAccountB, tokenAccountA, tokenAccountB, mintA, mintB, initialAmpFactor, targetAmpFactor, startRampTimestamp, stopRampTimeStamp, fees)];
                }
            });
        });
    };
    /**
     * Constructor for new StableSwap client object
     * @param connection
     * @param payer
     * @param stableSwapAccount
     * @param authority
     * @param adminAccount
     * @param adminFeeAccountA
     * @param adminFeeAccountB
     * @param tokenAccountA
     * @param tokenAccountB
     * @param poolTokenMint
     * @param poolTokenAccount
     * @param mintA
     * @param mintB
     * @param swapProgramId
     * @param tokenProgramId
     * @param nonce
     * @param ampFactor
     * @param fees
     */
    StableSwap.createStableSwap = function (connection, payer, stableSwapAccount, authority, adminAccount, adminFeeAccountA, adminFeeAccountB, tokenMintA, tokenAccountA, tokenMintB, tokenAccountB, poolTokenMint, poolTokenAccount, mintA, mintB, swapProgramId, tokenProgramId, nonce, ampFactor, fees) {
        if (fees === void 0) { fees = fees_1.DEFAULT_FEES; }
        return __awaiter(this, void 0, void 0, function () {
            var balanceNeeded, transaction, instruction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, StableSwap.getMinBalanceRentForExemptStableSwap(connection)];
                    case 1:
                        balanceNeeded = _a.sent();
                        transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
                            fromPubkey: payer.publicKey,
                            newAccountPubkey: stableSwapAccount.publicKey,
                            lamports: balanceNeeded,
                            space: layout.StableSwapLayout.span,
                            programId: swapProgramId,
                        }));
                        instruction = instructions.createInitSwapInstruction(stableSwapAccount, authority, adminAccount, adminFeeAccountA, adminFeeAccountB, tokenMintA, tokenAccountA, tokenMintB, tokenAccountB, poolTokenMint, poolTokenAccount, swapProgramId, tokenProgramId, nonce, ampFactor, fees);
                        transaction.add(instruction);
                        return [4 /*yield*/, send_and_confirm_transaction_1.sendAndConfirmTransaction("createAccount and InitializeSwap", connection, transaction, payer, stableSwapAccount)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new StableSwap(connection, stableSwapAccount.publicKey, swapProgramId, tokenProgramId, poolTokenMint, authority, adminAccount, adminFeeAccountA, adminFeeAccountB, tokenAccountA, tokenAccountB, mintA, mintB, ampFactor, ampFactor, constants_1.ZERO_TS, constants_1.ZERO_TS, fees)];
                }
            });
        });
    };
    /**
     * Get the virtual price of the pool.
     */
    StableSwap.prototype.getVirtualPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenAData, tokenBData, poolMintData, e_1, tokenA, tokenB, amountA, amountB, D, poolMint, poolSupply;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, account_1.loadAccount(this.connection, this.tokenAccountA, this.tokenProgramId)];
                    case 1:
                        tokenAData = _a.sent();
                        return [4 /*yield*/, account_1.loadAccount(this.connection, this.tokenAccountB, this.tokenProgramId)];
                    case 2:
                        tokenBData = _a.sent();
                        return [4 /*yield*/, account_1.loadAccount(this.connection, this.poolTokenMint, this.tokenProgramId)];
                    case 3:
                        poolMintData = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 5:
                        tokenA = spl_token_1.AccountLayout.decode(tokenAData);
                        tokenB = spl_token_1.AccountLayout.decode(tokenBData);
                        amountA = u64_1.NumberU64.fromBuffer(tokenA.amount);
                        amountB = u64_1.NumberU64.fromBuffer(tokenB.amount);
                        D = calculator_1.computeD(new bn_js_1.default(this.initialAmpFactor), amountA, amountB);
                        poolMint = spl_token_1.MintLayout.decode(poolMintData);
                        poolSupply = u64_1.NumberU64.fromBuffer(poolMint.supply);
                        return [2 /*return*/, D.toNumber() / poolSupply.toNumber()];
                }
            });
        });
    };
    /**
     * Swap token A for token B
     * @param userSource
     * @param poolSource
     * @param poolDestination
     * @param userDestination
     * @param amountIn
     * @param minimumAmountOut
     */
    StableSwap.prototype.swap = function (userSource, poolSource, poolDestination, userDestination, amountIn, minimumAmountOut) {
        var adminDestination = poolDestination === this.tokenAccountA
            ? this.adminFeeAccountA
            : this.adminFeeAccountB;
        return new web3_js_1.Transaction().add(instructions.swapInstruction(this.stableSwap, this.authority, userSource, poolSource, poolDestination, userDestination, adminDestination, this.swapProgramId, this.tokenProgramId, amountIn, minimumAmountOut));
    };
    /**
     * Deposit tokens into the pool
     * @param userAccountA
     * @param userAccountB
     * @param poolAccount
     * @param tokenAmountA
     * @param tokenAmountB
     * @param minimumPoolTokenAmount
     */
    StableSwap.prototype.deposit = function (userAccountA, userAccountB, poolTokenAccount, tokenAmountA, tokenAmountB, minimumPoolTokenAmount) {
        return new web3_js_1.Transaction().add(instructions.depositInstruction(this.stableSwap, this.authority, userAccountA, userAccountB, this.tokenAccountA, this.tokenAccountB, this.poolTokenMint, poolTokenAccount, this.swapProgramId, this.tokenProgramId, tokenAmountA, tokenAmountB, minimumPoolTokenAmount));
    };
    /**
     * Withdraw tokens from the pool
     * @param userAccountA
     * @param userAccountB
     * @param poolAccount
     * @param poolTokenAmount
     * @param minimumTokenA
     * @param minimumTokenB
     */
    StableSwap.prototype.withdraw = function (userAccountA, userAccountB, poolAccount, poolTokenAmount, minimumTokenA, minimumTokenB) {
        return new web3_js_1.Transaction().add(instructions.withdrawInstruction(this.stableSwap, this.authority, this.poolTokenMint, poolAccount, this.tokenAccountA, this.tokenAccountB, userAccountA, userAccountB, this.adminFeeAccountA, this.adminFeeAccountB, this.swapProgramId, this.tokenProgramId, poolTokenAmount, minimumTokenA, minimumTokenB));
    };
    return StableSwap;
}());
exports.StableSwap = StableSwap;
// async function main() {
// let saberPool = await StableSwap.loadStableSwap(
// new Connection("https://api.mainnet-beta.solana.com"),
// new PublicKey("B2izdXFYb2sNwbWWHmh75T4aQFtfXsUxem9u2p61HGzf"),
// new PublicKey("SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ")
// );
// console.log(await saberPool.getVirtualPrice());
// }
// main().then(
// () => process.exit(),
// err => {
// console.error("Failed to complete action.");
// console.error(err);
// process.exit(-1);
// },
// );
//
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhYmxlLXN3YXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3RhYmxlLXN3YXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBdUI7QUFFdkIsMkNBS3lCO0FBQ3pCLCtDQUE4RDtBQUU5RCx5Q0FBd0Q7QUFDeEQsK0JBQTRDO0FBQzVDLDJEQUErQztBQUMvQywrQ0FBbUM7QUFDbkMsMENBQTZDO0FBQzdDLGdEQUE2QztBQUM3QyxvRkFBZ0Y7QUFDaEYsa0NBQXVDO0FBRXZDOztHQUVHO0FBQ0g7SUEyRkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0JHO0lBQ0gsb0JBQ0UsVUFBc0IsRUFDdEIsVUFBcUIsRUFDckIsYUFBd0IsRUFDeEIsY0FBeUIsRUFDekIsYUFBd0IsRUFDeEIsU0FBb0IsRUFDcEIsWUFBdUIsRUFDdkIsZ0JBQTJCLEVBQzNCLGdCQUEyQixFQUMzQixhQUF3QixFQUN4QixhQUF3QixFQUN4QixLQUFnQixFQUNoQixLQUFnQixFQUNoQixnQkFBd0IsRUFDeEIsZUFBdUIsRUFDdkIsa0JBQTBCLEVBQzFCLGlCQUF5QixFQUN6QixJQUF5QjtRQUF6QixxQkFBQSxFQUFBLE9BQWEsbUJBQVk7UUFFekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7UUFDakMsSUFBSSxDQUFD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QUcsQ0FDMUIsWUFBWSxDQUFDLG1CQUFtQixDQUM5QixJQUFJLENBQUMsVUFBVSxFQUNmLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLGFBQWEsRUFDbEIsV0FBVyxFQUNYLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxhQUFhLEVBQ2xCLFlBQVksRUFDWixZQUFZLEVBQ1osSUFBSSxDQUFDLGdCQUFnQixFQUNyQixJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxjQUFjLEVBQ25CLGVBQWUsRUFDZixhQUFhLEVBQ2IsYUFBYSxDQUNkLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUExZUQsSUEwZUM7QUExZVksZ0NBQVU7QUE2ZXZCLDBCQUEwQjtBQUN4QixtREFBbUQ7QUFDakQseURBQXlEO0FBQ3pELGlFQUFpRTtBQUNqRSwrREFBK0Q7QUFDakUsS0FBSztBQUNMLGtEQUFrRDtBQUNwRCxJQUFJO0FBQ0osZUFBZTtBQUNiLHdCQUF3QjtBQUN4QixXQUFXO0FBQ1QsK0NBQStDO0FBQy9DLHNCQUFzQjtBQUN0QixvQkFBb0I7QUFDdEIsS0FBSztBQUNQLEtBQUs7QUFDTCxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJOIGZyb20gXCJibi5qc1wiO1xuaW1wb3J0IHsgQ29ubmVjdGlvbiB9IGZyb20gXCJAc29sYW5hL3dlYjMuanNcIjtcbmltcG9ydCB7XG4gIEFjY291bnQsXG4gIFB1YmxpY0tleSxcbiAgU3lzdGVtUHJvZ3JhbSxcbiAgVHJhbnNhY3Rpb24sXG59IGZyb20gXCJAc29sYW5hL3dlYjMuanNcIjtcbmltcG9ydCB7IEFjY291bnRMYXlvdXQsIE1pbnRMYXlvdXQgfSBmcm9tIFwiQHNvbGFuYS9zcGwtdG9rZW5cIjtcblxuaW1wb3J0IHsgVE9LRU5fUFJPR1JBTV9JRCwgWkVST19UUyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgREVGQVVMVF9GRUVTLCBGZWVzIH0gZnJvbSBcIi4vZmVlc1wiO1xuaW1wb3J0ICogYXMgaW5zdHJ1Y3Rpb25zIGZyb20gXCIuL2luc3RydWN0aW9uc1wiO1xuaW1wb3J0ICogYXMgbGF5b3V0IGZyb20gXCIuL2xheW91dFwiO1xuaW1wb3J0IHsgbG9hZEFjY291bnQgfSBmcm9tIFwiLi91dGlsL2FjY291bnRcIjtcbmltcG9ydCB7IGNvbXB1dGVEIH0gZnJvbSBcIi4vdXRpbC9jYWxjdWxhdG9yXCI7XG5pbXBvcnQgeyBzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uIH0gZnJvbSBcIi4vdXRpbC9zZW5kLWFuZC1jb25maXJtLXRyYW5zYWN0aW9uXCI7XG5pbXBvcnQgeyBOdW1iZXJVNjQgfSBmcm9tIFwiLi91dGlsL3U2NFwiO1xuXG4vKipcbiAqIEEgcHJvZ3JhbSB0byBleGNoYW5nZSB0b2tlbnMgYWdhaW5zdCBhIHBvb2wgb2YgbGlxdWlkaXR5XG4gKi9cbmV4cG9ydCBjbGFzcyBTdGFibGVTd2FwIHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBQcm9ncmFtIElkZW50aWZpZXIgZm9yIHRoZSBTd2FwIHByb2dyYW1cbiAgICovXG4gIHN3YXBQcm9ncmFtSWQ6IFB1YmxpY0tleTtcblxuICAvKipcbiAgICogUHJvZ3JhbSBJZGVudGlmaWVyIGZvciB0aGUgVG9rZW4gcHJvZ3JhbVxuICAgKi9cbiAgdG9rZW5Qcm9ncmFtSWQ6IFB1YmxpY0tleTtcblxuICAvKipcbiAgICogVGhlIHB1YmxpYyBrZXkgaWRlbnRpZnlpbmcgdGhpcyBzd2FwIHByb2dyYW1cbiAgICovXG4gIHN0YWJsZVN3YXA6IFB1YmxpY0tleTtcblxuICAvKipcbiAgICogVGhlIHB1YmxpYyBrZXkgZm9yIHRoZSBsaXF1aWRpdHkgcG9vbCB0b2tlbiBtaW50XG4gICAqL1xuICBwb29sVG9rZW5NaW50OiBQdWJsaWNLZXk7XG5cbiAgLyoqXG4gICAqIEF1dGhvcml0eVxuICAgKi9cbiAgYXV0aG9yaXR5OiBQdWJsaWNLZXk7XG5cbiAgLyoqXG4gICAqIEFkbWluIGFjY291bnRcbiAgICovXG4gIGFkbWluQWNjb3VudDogUHVibGljS2V5O1xuXG4gIC8qKlxuICAgKiBBZG1pbiBmZWUgYWNjb3VudCBmb3IgdG9rZW4gQVxuICAgKi9cbiAgYWRtaW5GZWVBY2NvdW50QTogUHVibGljS2V5O1xuXG4gIC8qKlxuICAgKiBBZG1pbiBmZWUgYWNjb3VudCBmb3IgdG9rZW4gQlxuICAgKi9cbiAgYWRtaW5GZWVBY2NvdW50QjogUHVibGljS2V5O1xuXG4gIC8qKlxuICAgKiBUaGUgcHVibGljIGtleSBmb3IgdGhlIGZpcnN0IHRva2VuIGFjY291bnQgb2YgdGhlIHRyYWRpbmcgcGFpclxuICAgKi9cbiAgdG9rZW5BY2NvdW50QTogUHVibGljS2V5O1xuXG4gIC8qKlxuICAgKiBUaGUgcHVibGljIGtleSBmb3IgdGhlIHNlY29uZCB0b2tlbiBhY2NvdW50IG9mIHRoZSB0cmFkaW5nIHBhaXJcbiAgICovXG4gIHRva2VuQWNjb3VudEI6IFB1YmxpY0tleTtcblxuICAvKipcbiAgICogVGhlIHB1YmxpYyBrZXkgZm9yIHRoZSBtaW50IG9mIHRoZSBmaXJzdCB0b2tlbiBhY2NvdW50IG9mIHRoZSB0cmFkaW5nIHBhaXJcbiAgICovXG4gIG1pbnRBOiBQdWJsaWNLZXk7XG5cbiAgLyoqXG4gICAqIFRoZSBwdWJsaWMga2V5IGZvciB0aGUgbWludCBvZiB0aGUgc2Vjb25kIHRva2VuIGFjY291bnQgb2YgdGhlIHRyYWRpbmcgcGFpclxuICAgKi9cbiAgbWludEI6IFB1YmxpY0tleTtcblxuICAvKipcbiAgICogSW5pdGlhbCBhbXBsaWZpY2F0aW9uIGNvZWZmaWNpZW50IChBKVxuICAgKi9cbiAgaW5pdGlhbEFtcEZhY3RvcjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUYXJnZXQgYW1wbGlmaWNhdGlvbiBjb2VmZmljaWVudCAoQSlcbiAgICovXG4gIHRhcmdldEFtcEZhY3RvcjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBSYW1wIEEgc3RhcnQgdGltZXN0YW1wXG4gICAqL1xuICBzdGFydFJhbXBUaW1lc3RhbXA6IG51bWJlcjtcblxuICAvKipcbiAgICogUmFtcCBBIHN0YXJ0IHRpbWVzdGFtcFxuICAgKi9cbiAgc3RvcFJhbXBUaW1lc3RhbXA6IG51bWJlcjtcblxuICAvKipcbiAgICogRmVlc1xuICAgKi9cbiAgZmVlczogRmVlcztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIG5ldyBTdGFibGVTd2FwIGNsaWVudCBvYmplY3RcbiAgICogQHBhcmFtIGNvbm5lY3Rpb25cbiAgICogQHBhcmFtIHN0YWJsZVN3YXBcbiAgICogQHBhcmFtIHN3YXBQcm9ncmFtSWRcbiAgICogQHBhcmFtIHRva2VuUHJvZ3JhbUlkXG4gICAqIEBwYXJhbSBwb29sVG9rZW5NaW50XG4gICAqIEBwYXJhbSBhdXRob3JpdHlcbiAgICogQHBhcmFtIGFkbWluQWNjb3VudFxuICAgKiBAcGFyYW0gYWRtaW5GZWVBY2NvdW50QVxuICAgKiBAcGFyYW0gYWRtaW5GZWVBY2NvdW50QlxuICAgKiBAcGFyYW0gdG9rZW5BY2NvdW50QVxuICAgKiBAcGFyYW0gdG9rZW5BY2NvdW50QlxuICAgKiBAcGFyYW0gbWludEFcbiAgICogQHBhcmFtIG1pbnRCXG4gICAqIEBwYXJhbSBpbml0aWFsQW1wRmFjdG9yXG4gICAqIEBwYXJhbSB0YXJnZXRBbXBGYWN0b3JcbiAgICogQHBhcmFtIHN0YXJ0UmFtcFRpbWVzdGFtcFxuICAgKiBAcGFyYW0gc3RvcFJhbXBUaW1lU3RhbXBcbiAgICogQHBhcmFtIGZlZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbm5lY3Rpb246IENvbm5lY3Rpb24sXG4gICAgc3RhYmxlU3dhcDogUHVibGljS2V5LFxuICAgIHN3YXBQcm9ncmFtSWQ6IFB1YmxpY0tleSxcbiAgICB0b2tlblByb2dyYW1JZDogUHVibGljS2V5LFxuICAgIHBvb2xUb2tlbk1pbnQ6IFB1YmxpY0tleSxcbiAgICBhdXRob3JpdHk6IFB1YmxpY0tleSxcbiAgICBhZG1pbkFjY291bnQ6IFB1YmxpY0tleSxcbiAgICBhZG1pbkZlZUFjY291bnRBOiBQdWJsaWNLZXksXG4gICAgYWRtaW5GZWVBY2NvdW50QjogUHVibGljS2V5LFxuICAgIHRva2VuQWNjb3VudEE6IFB1YmxpY0tleSxcbiAgICB0b2tlbkFjY291bnRCOiBQdWJsaWNLZXksXG4gICAgbWludEE6IFB1YmxpY0tleSxcbiAgICBtaW50QjogUHVibGljS2V5LFxuICAgIGluaXRpYWxBbXBGYWN0b3I6IG51bWJlcixcbiAgICB0YXJnZXRBbXBGYWN0b3I6IG51bWJlcixcbiAgICBzdGFydFJhbXBUaW1lc3RhbXA6IG51bWJlcixcbiAgICBzdG9wUmFtcFRpbWVTdGFtcDogbnVtYmVyLFxuICAgIGZlZXM6IEZlZXMgPSBERUZBVUxUX0ZFRVNcbiAgKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcbiAgICB0aGlzLnN0YWJsZVN3YXAgPSBzdGFibGVTd2FwO1xuICAgIHRoaXMuc3dhcFByb2dyYW1JZCA9IHN3YXBQcm9ncmFtSWQ7XG4gICAgdGhpcy50b2tlblByb2dyYW1JZCA9IHRva2VuUHJvZ3JhbUlkO1xuICAgIHRoaXMucG9vbFRva2VuTWludCA9IHBvb2xUb2tlbk1pbnQ7XG4gICAgdGhpcy5hdXRob3JpdHkgPSBhdXRob3JpdHk7XG4gICAgdGhpcy5hZG1pbkFjY291bnQgPSBhZG1pbkFjY291bnQ7XG4gICAgdGhpcy5hZG1pbkZlZUFjY291bnRBID0gYWRtaW5GZWVBY2NvdW50QTtcbiAgICB0aGlzLmFkbWluRmVlQWNjb3VudEIgPSBhZG1pbkZlZUFjY291bnRCO1xuICAgIHRoaXMudG9rZW5BY2NvdW50QSA9IHRva2VuQWNjb3VudEE7XG4gICAgdGhpcy50b2tlbkFjY291bnRCID0gdG9rZW5BY2NvdW50QjtcbiAgICB0aGlzLm1pbnRBID0gbWludEE7XG4gICAgdGhpcy5taW50QiA9IG1pbnRCO1xuICAgIHRoaXMuaW5pdGlhbEFtcEZhY3RvciA9IGluaXRpYWxBbXBGYWN0b3I7XG4gICAgdGhpcy50YXJnZXRBbXBGYWN0b3IgPSB0YXJnZXRBbXBGYWN0b3I7XG4gICAgdGhpcy5zdGFydFJhbXBUaW1lc3RhbXAgPSBzdGFydFJhbXBUaW1lc3RhbXA7XG4gICAgdGhpcy5zdG9wUmFtcFRpbWVzdGFtcCA9IHN0b3BSYW1wVGltZVN0YW1wO1xuICAgIHRoaXMuZmVlcyA9IGZlZXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBtaW5pbXVtIGJhbGFuY2UgZm9yIHRoZSB0b2tlbiBzd2FwIGFjY291bnQgdG8gYmUgcmVudCBleGVtcHRcbiAgICpcbiAgICogQHJldHVybiBOdW1iZXIgb2YgbGFtcG9ydHMgcmVxdWlyZWRcbiAgICovXG4gIHN0YXRpYyBhc3luYyBnZXRNaW5CYWxhbmNlUmVudEZvckV4ZW1wdFN0YWJsZVN3YXAoXG4gICAgY29ubmVjdGlvbjogQ29ubmVjdGlvblxuICApOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBhd2FpdCBjb25uZWN0aW9uLmdldE1pbmltdW1CYWxhbmNlRm9yUmVudEV4ZW1wdGlvbihcbiAgICAgIGxheW91dC5TdGFibGVTd2FwTGF5b3V0LnNwYW5cbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYW4gb25jaGFpbiBTdGFibGVTd2FwIHByb2dyYW1cbiAgICogQHBhcmFtIGNvbm5lY3Rpb24gVGhlIGNvbm5lY3Rpb24gdG8gdXNlXG4gICAqIEBwYXJhbSBhZGRyZXNzIFRoZSBwdWJsaWMga2V5IG9mIHRoZSBhY2NvdW50IHRvIGxvYWRcbiAgICogQHBhcmFtIHByb2dyYW1JZCBBZGRyZXNzIG9mIHRoZSBvbmNoYWluIFN0YWJsZVN3YXAgcHJvZ3JhbVxuICAgKiBAcGFyYW0gcGF5ZXIgUGF5cyBmb3IgdGhlIHRyYW5zYWN0aW9uXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgbG9hZFN0YWJsZVN3YXAoXG4gICAgY29ubmVjdGlvbjogQ29ubmVjdGlvbixcbiAgICBhZGRyZXNzOiBQdWJsaWNLZXksXG4gICAgcHJvZ3JhbUlkOiBQdWJsaWNLZXlcbiAgKTogUHJvbWlzZTxTdGFibGVTd2FwPiB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGxvYWRBY2NvdW50KGNvbm5lY3Rpb24sIGFkZHJlc3MsIHByb2dyYW1JZCk7XG4gICAgY29uc3Qgc3RhYmxlU3dhcERhdGEgPSBsYXlvdXQuU3RhYmxlU3dhcExheW91dC5kZWNvZGUoZGF0YSk7XG4gICAgaWYgKCFzdGFibGVTd2FwRGF0YS5pc0luaXRpYWxpemVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdG9rZW4gc3dhcCBzdGF0ZWApO1xuICAgIH1cblxuICAgIGNvbnN0IFthdXRob3JpdHldID0gYXdhaXQgUHVibGljS2V5LmZpbmRQcm9ncmFtQWRkcmVzcyhcbiAgICAgIFthZGRyZXNzLnRvQnVmZmVyKCldLFxuICAgICAgcHJvZ3JhbUlkXG4gICAgKTtcbiAgICBjb25zdCBhZG1pbkFjY291bnQgPSBuZXcgUHVibGljS2V5KHN0YWJsZVN3YXBEYXRhLmFkbWluQWNjb3VudCk7XG4gICAgY29uc3QgYWRtaW5GZWVBY2NvdW50QSA9IG5ldyBQdWJsaWNLZXkoc3RhYmxlU3dhcERhdGEuYWRtaW5GZWVBY2NvdW50QSk7XG4gICAgY29uc3QgYWRtaW5GZWVBY2NvdW50QiA9IG5ldyBQdWJsaWNLZXkoc3RhYmxlU3dhcERhdGEuYWRtaW5GZWVBY2NvdW50Qik7XG4gICAgY29uc3QgdG9rZW5BY2NvdW50QSA9IG5ldyBQdWJsaWNLZXkoc3RhYmxlU3dhcERhdGEudG9rZW5BY2NvdW50QSk7XG4gICAgY29uc3QgdG9rZW5BY2NvdW50QiA9IG5ldyBQdWJsaWNLZXkoc3RhYmxlU3dhcERhdGEudG9rZW5BY2NvdW50Qik7XG4gICAgY29uc3QgcG9vbFRva2VuTWludCA9IG5ldyBQdWJsaWNLZXkoc3RhYmxlU3dhcERhdGEudG9rZW5Qb29sKTtcbiAgICBjb25zdCBtaW50QSA9IG5ldyBQdWJsaWNLZXkoc3RhYmxlU3dhcERhdGEubWludEEpO1xuICAgIGNvbnN0IG1pbnRCID0gbmV3IFB1YmxpY0tleShzdGFibGVTd2FwRGF0YS5taW50Qik7XG4gICAgY29uc3QgdG9rZW5Qcm9ncmFtSWQgPSBUT0tFTl9QUk9HUkFNX0lEO1xuICAgIGNvbnN0IGluaXRpYWxBbXBGYWN0b3IgPSBzdGFibGVTd2FwRGF0YS5pbml0aWFsQW1wRmFjdG9yO1xuICAgIGNvbnN0IHRhcmdldEFtcEZhY3RvciA9IHN0YWJsZVN3YXBEYXRhLnRhcmdldEFtcEZhY3RvcjtcbiAgICBjb25zdCBzdGFydFJhbXBUaW1lc3RhbXAgPSBzdGFibGVTd2FwRGF0YS5zdGFydFJhbXBUcztcbiAgICBjb25zdCBzdG9wUmFtcFRpbWVTdGFtcCA9IHN0YWJsZVN3YXBEYXRhLnN0b3BSYW1wVHM7XG4gICAgY29uc3QgZmVlcyA9IHtcbiAgICAgIGFkbWluVHJhZGVGZWVOdW1lcmF0b3I6IHN0YWJsZVN3YXBEYXRhLmFkbWluVHJhZGVGZWVOdW1lcmF0b3IgYXMgbnVtYmVyLFxuICAgICAgYWRtaW5UcmFkZUZlZURlbm9taW5hdG9yOiBzdGFibGVTd2FwRGF0YS5hZG1pblRyYWRlRmVlRGVub21pbmF0b3IgYXMgbnVtYmVyLFxuICAgICAgYWRtaW5XaXRoZHJhd0ZlZU51bWVyYXRvcjogc3RhYmxlU3dhcERhdGEuYWRtaW5XaXRoZHJhd0ZlZU51bWVyYXRvciBhcyBudW1iZXIsXG4gICAgICBhZG1pbldpdGhkcmF3RmVlRGVub21pbmF0b3I6IHN0YWJsZVN3YXBEYXRhLmFkbWluV2l0aGRyYXdGZWVEZW5vbWluYXRvciBhcyBudW1iZXIsXG4gICAgICB0cmFkZUZlZU51bWVyYXRvcjogc3RhYmxlU3dhcERhdGEudHJhZGVGZWVOdW1lcmF0b3IgYXMgbnVtYmVyLFxuICAgICAgdHJhZGVGZWVEZW5vbWluYXRvcjogc3RhYmxlU3dhcERhdGEudHJhZGVGZWVEZW5vbWluYXRvciBhcyBudW1iZXIsXG4gICAgICB3aXRoZHJhd0ZlZU51bWVyYXRvcjogc3RhYmxlU3dhcERhdGEud2l0aGRyYXdGZWVOdW1lcmF0b3IgYXMgbnVtYmVyLFxuICAgICAgd2l0aGRyYXdGZWVEZW5vbWluYXRvcjogc3RhYmxlU3dhcERhdGEud2l0aGRyYXdGZWVEZW5vbWluYXRvciBhcyBudW1iZXIsXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgU3RhYmxlU3dhcChcbiAgICAgIGNvbm5lY3Rpb24sXG4gICAgICBhZGRyZXNzLFxuICAgICAgcHJvZ3JhbUlkLFxuICAgICAgdG9rZW5Qcm9ncmFtSWQsXG4gICAgICBwb29sVG9rZW5NaW50LFxuICAgICAgYXV0aG9yaXR5LFxuICAgICAgYWRtaW5BY2NvdW50LFxuICAgICAgYWRtaW5GZWVBY2NvdW50QSxcbiAgICAgIGFkbWluRmVlQWNjb3VudEIsXG4gICAgICB0b2tlbkFjY291bnRBLFxuICAgICAgdG9rZW5BY2NvdW50QixcbiAgICAgIG1pbnRBLFxuICAgICAgbWludEIsXG4gICAgICBpbml0aWFsQW1wRmFjdG9yLFxuICAgICAgdGFyZ2V0QW1wRmFjdG9yLFxuICAgICAgc3RhcnRSYW1wVGltZXN0YW1wLFxuICAgICAgc3RvcFJhbXBUaW1lU3RhbXAsXG4gICAgICBmZWVzXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgbmV3IFN0YWJsZVN3YXAgY2xpZW50IG9iamVjdFxuICAgKiBAcGFyYW0gY29ubmVjdGlvblxuICAgKiBAcGFyYW0gcGF5ZXJcbiAgICogQHBhcmFtIHN0YWJsZVN3YXBBY2NvdW50XG4gICAqIEBwYXJhbSBhdXRob3JpdHlcbiAgICogQHBhcmFtIGFkbWluQWNjb3VudFxuICAgKiBAcGFyYW0gYWRtaW5GZWVBY2NvdW50QVxuICAgKiBAcGFyYW0gYWRtaW5GZWVBY2NvdW50QlxuICAgKiBAcGFyYW0gdG9rZW5BY2NvdW50QVxuICAgKiBAcGFyYW0gdG9rZW5BY2NvdW50QlxuICAgKiBAcGFyYW0gcG9vbFRva2VuTWludFxuICAgKiBAcGFyYW0gcG9vbFRva2VuQWNjb3VudFxuICAgKiBAcGFyYW0gbWludEFcbiAgICogQHBhcmFtIG1pbnRCXG4gICAqIEBwYXJhbSBzd2FwUHJvZ3JhbUlkXG4gICAqIEBwYXJhbSB0b2tlblByb2dyYW1JZFxuICAgKiBAcGFyYW0gbm9uY2VcbiAgICogQHBhcmFtIGFtcEZhY3RvclxuICAgKiBAcGFyYW0gZmVlc1xuICAgKi9cbiAgc3RhdGljIGFzeW5jIGNyZWF0ZVN0YWJsZVN3YXAoXG4gICAgY29ubmVjdGlvbjogQ29ubmVjdGlvbixcbiAgICBwYXllcjogQWNjb3VudCxcbiAgICBzdGFibGVTd2FwQWNjb3VudDogQWNjb3VudCxcbiAgICBhdXRob3JpdHk6IFB1YmxpY0tleSxcbiAgICBhZG1pbkFjY291bnQ6IFB1YmxpY0tleSxcbiAgICBhZG1pbkZlZUFjY291bnRBOiBQdWJsaWNLZXksXG4gICAgYWRtaW5GZWVBY2NvdW50QjogUHVibGljS2V5LFxuICAgIHRva2VuTWludEE6IFB1YmxpY0tleSxcbiAgICB0b2tlbkFjY291bnRBOiBQdWJsaWNLZXksXG4gICAgdG9rZW5NaW50QjogUHVibGljS2V5LFxuICAgIHRva2VuQWNjb3VudEI6IFB1YmxpY0tleSxcbiAgICBwb29sVG9rZW5NaW50OiBQdWJsaWNLZXksXG4gICAgcG9vbFRva2VuQWNjb3VudDogUHVibGljS2V5LFxuICAgIG1pbnRBOiBQdWJsaWNLZXksXG4gICAgbWludEI6IFB1YmxpY0tleSxcbiAgICBzd2FwUHJvZ3JhbUlkOiBQdWJsaWNLZXksXG4gICAgdG9rZW5Qcm9ncmFtSWQ6IFB1YmxpY0tleSxcbiAgICBub25jZTogbnVtYmVyLFxuICAgIGFtcEZhY3RvcjogbnVtYmVyLFxuICAgIGZlZXM6IEZlZXMgPSBERUZBVUxUX0ZFRVNcbiAgKTogUHJvbWlzZTxTdGFibGVTd2FwPiB7XG4gICAgLy8gQWxsb2NhdGUgbWVtb3J5IGZvciB0aGUgYWNjb3VudFxuICAgIGNvbnN0IGJhbGFuY2VOZWVkZWQgPSBhd2FpdCBTdGFibGVTd2FwLmdldE1pbkJhbGFuY2VSZW50Rm9yRXhlbXB0U3RhYmxlU3dhcChcbiAgICAgIGNvbm5lY3Rpb25cbiAgICApO1xuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKCkuYWRkKFxuICAgICAgU3lzdGVtUHJvZ3JhbS5jcmVhdGVBY2NvdW50KHtcbiAgICAgICAgZnJvbVB1YmtleTogcGF5ZXIucHVibGljS2V5LFxuICAgICAgICBuZXdBY2NvdW50UHVia2V5OiBzdGFibGVTd2FwQWNjb3VudC5wdWJsaWNLZXksXG4gICAgICAgIGxhbXBvcnRzOiBiYWxhbmNlTmVlZGVkLFxuICAgICAgICBzcGFjZTogbGF5b3V0LlN0YWJsZVN3YXBMYXlvdXQuc3BhbixcbiAgICAgICAgcHJvZ3JhbUlkOiBzd2FwUHJvZ3JhbUlkLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSBpbnN0cnVjdGlvbnMuY3JlYXRlSW5pdFN3YXBJbnN0cnVjdGlvbihcbiAgICAgIHN0YWJsZVN3YXBBY2NvdW50LFxuICAgICAgYXV0aG9yaXR5LFxuICAgICAgYWRtaW5BY2NvdW50LFxuICAgICAgYWRtaW5GZWVBY2NvdW50QSxcbiAgICAgIGFkbWluRmVlQWNjb3VudEIsXG4gICAgICB0b2tlbk1pbnRBLFxuICAgICAgdG9rZW5BY2NvdW50QSxcbiAgICAgIHRva2VuTWludEIsXG4gICAgICB0b2tlbkFjY291bnRCLFxuICAgICAgcG9vbFRva2VuTWludCxcbiAgICAgIHBvb2xUb2tlbkFjY291bnQsXG4gICAgICBzd2FwUHJvZ3JhbUlkLFxuICAgICAgdG9rZW5Qcm9ncmFtSWQsXG4gICAgICBub25jZSxcbiAgICAgIGFtcEZhY3RvcixcbiAgICAgIGZlZXNcbiAgICApO1xuICAgIHRyYW5zYWN0aW9uLmFkZChpbnN0cnVjdGlvbik7XG5cbiAgICBhd2FpdCBzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uKFxuICAgICAgXCJjcmVhdGVBY2NvdW50IGFuZCBJbml0aWFsaXplU3dhcFwiLFxuICAgICAgY29ubmVjdGlvbixcbiAgICAgIHRyYW5zYWN0aW9uLFxuICAgICAgcGF5ZXIsXG4gICAgICBzdGFibGVTd2FwQWNjb3VudFxuICAgICk7XG5cbiAgICByZXR1cm4gbmV3IFN0YWJsZVN3YXAoXG4gICAgICBjb25uZWN0aW9uLFxuICAgICAgc3RhYmxlU3dhcEFjY291bnQucHVibGljS2V5LFxuICAgICAgc3dhcFByb2dyYW1JZCxcbiAgICAgIHRva2VuUHJvZ3JhbUlkLFxuICAgICAgcG9vbFRva2VuTWludCxcbiAgICAgIGF1dGhvcml0eSxcbiAgICAgIGFkbWluQWNjb3VudCxcbiAgICAgIGFkbWluRmVlQWNjb3VudEEsXG4gICAgICBhZG1pbkZlZUFjY291bnRCLFxuICAgICAgdG9rZW5BY2NvdW50QSxcbiAgICAgIHRva2VuQWNjb3VudEIsXG4gICAgICBtaW50QSxcbiAgICAgIG1pbnRCLFxuICAgICAgYW1wRmFjdG9yLFxuICAgICAgYW1wRmFjdG9yLFxuICAgICAgWkVST19UUyxcbiAgICAgIFpFUk9fVFMsXG4gICAgICBmZWVzXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZpcnR1YWwgcHJpY2Ugb2YgdGhlIHBvb2wuXG4gICAqL1xuICBhc3luYyBnZXRWaXJ0dWFsUHJpY2UoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICBsZXQgdG9rZW5BRGF0YTtcbiAgICBsZXQgdG9rZW5CRGF0YTtcbiAgICBsZXQgcG9vbE1pbnREYXRhO1xuICAgIHRyeSB7XG4gICAgICB0b2tlbkFEYXRhID0gYXdhaXQgbG9hZEFjY291bnQoXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbixcbiAgICAgICAgdGhpcy50b2tlbkFjY291bnRBLFxuICAgICAgICB0aGlzLnRva2VuUHJvZ3JhbUlkXG4gICAgICApO1xuICAgICAgdG9rZW5CRGF0YSA9IGF3YWl0IGxvYWRBY2NvdW50KFxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24sXG4gICAgICAgIHRoaXMudG9rZW5BY2NvdW50QixcbiAgICAgICAgdGhpcy50b2tlblByb2dyYW1JZFxuICAgICAgKTtcbiAgICAgIHBvb2xNaW50RGF0YSA9IGF3YWl0IGxvYWRBY2NvdW50KFxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24sXG4gICAgICAgIHRoaXMucG9vbFRva2VuTWludCxcbiAgICAgICAgdGhpcy50b2tlblByb2dyYW1JZFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZSk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW5BID0gQWNjb3VudExheW91dC5kZWNvZGUodG9rZW5BRGF0YSk7XG4gICAgY29uc3QgdG9rZW5CID0gQWNjb3VudExheW91dC5kZWNvZGUodG9rZW5CRGF0YSk7XG4gICAgY29uc3QgYW1vdW50QSA9IE51bWJlclU2NC5mcm9tQnVmZmVyKHRva2VuQS5hbW91bnQpO1xuICAgIGNvbnN0IGFtb3VudEIgPSBOdW1iZXJVNjQuZnJvbUJ1ZmZlcih0b2tlbkIuYW1vdW50KTtcbiAgICBjb25zdCBEID0gY29tcHV0ZUQobmV3IEJOKHRoaXMuaW5pdGlhbEFtcEZhY3RvciksIGFtb3VudEEsIGFtb3VudEIpO1xuXG4gICAgY29uc3QgcG9vbE1pbnQgPSBNaW50TGF5b3V0LmRlY29kZShwb29sTWludERhdGEpO1xuICAgIGNvbnN0IHBvb2xTdXBwbHkgPSBOdW1iZXJVNjQuZnJvbUJ1ZmZlcihwb29sTWludC5zdXBwbHkpO1xuXG4gICAgcmV0dXJuIEQudG9OdW1iZXIoKSAvIHBvb2xTdXBwbHkudG9OdW1iZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTd2FwIHRva2VuIEEgZm9yIHRva2VuIEJcbiAgICogQHBhcmFtIHVzZXJTb3VyY2VcbiAgICogQHBhcmFtIHBvb2xTb3VyY2VcbiAgICogQHBhcmFtIHBvb2xEZXN0aW5hdGlvblxuICAgKiBAcGFyYW0gdXNlckRlc3RpbmF0aW9uXG4gICAqIEBwYXJhbSBhbW91bnRJblxuICAgKiBAcGFyYW0gbWluaW11bUFtb3VudE91dFxuICAgKi9cbiAgc3dhcChcbiAgICB1c2VyU291cmNlOiBQdWJsaWNLZXksXG4gICAgcG9vbFNvdXJjZTogUHVibGljS2V5LFxuICAgIHBvb2xEZXN0aW5hdGlvbjogUHVibGljS2V5LFxuICAgIHVzZXJEZXN0aW5hdGlvbjogUHVibGljS2V5LFxuICAgIGFtb3VudEluOiBudW1iZXIsXG4gICAgbWluaW11bUFtb3VudE91dDogbnVtYmVyXG4gICk6IFRyYW5zYWN0aW9uIHtcbiAgICBjb25zdCBhZG1pbkRlc3RpbmF0aW9uID1cbiAgICAgIHBvb2xEZXN0aW5hdGlvbiA9PT0gdGhpcy50b2tlbkFjY291bnRBXG4gICAgICAgID8gdGhpcy5hZG1pbkZlZUFjY291bnRBXG4gICAgICAgIDogdGhpcy5hZG1pbkZlZUFjY291bnRCO1xuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb24oKS5hZGQoXG4gICAgICBpbnN0cnVjdGlvbnMuc3dhcEluc3RydWN0aW9uKFxuICAgICAgICB0aGlzLnN0YWJsZVN3YXAsXG4gICAgICAgIHRoaXMuYXV0aG9yaXR5LFxuICAgICAgICB1c2VyU291cmNlLFxuICAgICAgICBwb29sU291cmNlLFxuICAgICAgICBwb29sRGVzdGluYXRpb24sXG4gICAgICAgIHVzZXJEZXN0aW5hdGlvbixcbiAgICAgICAgYWRtaW5EZXN0aW5hdGlvbixcbiAgICAgICAgdGhpcy5zd2FwUHJvZ3JhbUlkLFxuICAgICAgICB0aGlzLnRva2VuUHJvZ3JhbUlkLFxuICAgICAgICBhbW91bnRJbixcbiAgICAgICAgbWluaW11bUFtb3VudE91dFxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGVwb3NpdCB0b2tlbnMgaW50byB0aGUgcG9vbFxuICAgKiBAcGFyYW0gdXNlckFjY291bnRBXG4gICAqIEBwYXJhbSB1c2VyQWNjb3VudEJcbiAgICogQHBhcmFtIHBvb2xBY2NvdW50XG4gICAqIEBwYXJhbSB0b2tlbkFtb3VudEFcbiAgICogQHBhcmFtIHRva2VuQW1vdW50QlxuICAgKiBAcGFyYW0gbWluaW11bVBvb2xUb2tlbkFtb3VudFxuICAgKi9cbiAgZGVwb3NpdChcbiAgICB1c2VyQWNjb3VudEE6IFB1YmxpY0tleSxcbiAgICB1c2VyQWNjb3VudEI6IFB1YmxpY0tleSxcbiAgICBwb29sVG9rZW5BY2NvdW50OiBQdWJsaWNLZXksXG4gICAgdG9rZW5BbW91bnRBOiBudW1iZXIsXG4gICAgdG9rZW5BbW91bnRCOiBudW1iZXIsXG4gICAgbWluaW11bVBvb2xUb2tlbkFtb3VudDogbnVtYmVyXG4gICk6IFRyYW5zYWN0aW9uIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zYWN0aW9uKCkuYWRkKFxuICAgICAgaW5zdHJ1Y3Rpb25zLmRlcG9zaXRJbnN0cnVjdGlvbihcbiAgICAgICAgdGhpcy5zdGFibGVTd2FwLFxuICAgICAgICB0aGlzLmF1dGhvcml0eSxcbiAgICAgICAgdXNlckFjY291bnRBLFxuICAgICAgICB1c2VyQWNjb3VudEIsXG4gICAgICAgIHRoaXMudG9rZW5BY2NvdW50QSxcbiAgICAgICAgdGhpcy50b2tlbkFjY291bnRCLFxuICAgICAgICB0aGlzLnBvb2xUb2tlbk1pbnQsXG4gICAgICAgIHBvb2xUb2tlbkFjY291bnQsXG4gICAgICAgIHRoaXMuc3dhcFByb2dyYW1JZCxcbiAgICAgICAgdGhpcy50b2tlblByb2dyYW1JZCxcbiAgICAgICAgdG9rZW5BbW91bnRBLFxuICAgICAgICB0b2tlbkFtb3VudEIsXG4gICAgICAgIG1pbmltdW1Qb29sVG9rZW5BbW91bnRcbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFdpdGhkcmF3IHRva2VucyBmcm9tIHRoZSBwb29sXG4gICAqIEBwYXJhbSB1c2VyQWNjb3VudEFcbiAgICogQHBhcmFtIHVzZXJBY2NvdW50QlxuICAgKiBAcGFyYW0gcG9vbEFjY291bnRcbiAgICogQHBhcmFtIHBvb2xUb2tlbkFtb3VudFxuICAgKiBAcGFyYW0gbWluaW11bVRva2VuQVxuICAgKiBAcGFyYW0gbWluaW11bVRva2VuQlxuICAgKi9cbiAgd2l0aGRyYXcoXG4gICAgdXNlckFjY291bnRBOiBQdWJsaWNLZXksXG4gICAgdXNlckFjY291bnRCOiBQdWJsaWNLZXksXG4gICAgcG9vbEFjY291bnQ6IFB1YmxpY0tleSxcbiAgICBwb29sVG9rZW5BbW91bnQ6IG51bWJlcixcbiAgICBtaW5pbXVtVG9rZW5BOiBudW1iZXIsXG4gICAgbWluaW11bVRva2VuQjogbnVtYmVyXG4gICk6IFRyYW5zYWN0aW9uIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zYWN0aW9uKCkuYWRkKFxuICAgICAgaW5zdHJ1Y3Rpb25zLndpdGhkcmF3SW5zdHJ1Y3Rpb24oXG4gICAgICAgIHRoaXMuc3RhYmxlU3dhcCxcbiAgICAgICAgdGhpcy5hdXRob3JpdHksXG4gICAgICAgIHRoaXMucG9vbFRva2VuTWludCxcbiAgICAgICAgcG9vbEFjY291bnQsXG4gICAgICAgIHRoaXMudG9rZW5BY2NvdW50QSxcbiAgICAgICAgdGhpcy50b2tlbkFjY291bnRCLFxuICAgICAgICB1c2VyQWNjb3VudEEsXG4gICAgICAgIHVzZXJBY2NvdW50QixcbiAgICAgICAgdGhpcy5hZG1pbkZlZUFjY291bnRBLFxuICAgICAgICB0aGlzLmFkbWluRmVlQWNjb3VudEIsXG4gICAgICAgIHRoaXMuc3dhcFByb2dyYW1JZCxcbiAgICAgICAgdGhpcy50b2tlblByb2dyYW1JZCxcbiAgICAgICAgcG9vbFRva2VuQW1vdW50LFxuICAgICAgICBtaW5pbXVtVG9rZW5BLFxuICAgICAgICBtaW5pbXVtVG9rZW5CXG4gICAgICApXG4gICAgKTtcbiAgfVxufVxuXG5cbi8vIGFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIC8vIGxldCBzYWJlclBvb2wgPSBhd2FpdCBTdGFibGVTd2FwLmxvYWRTdGFibGVTd2FwKFxuICAgIC8vIG5ldyBDb25uZWN0aW9uKFwiaHR0cHM6Ly9hcGkubWFpbm5ldC1iZXRhLnNvbGFuYS5jb21cIiksXG4gICAgLy8gbmV3IFB1YmxpY0tleShcIkIyaXpkWEZZYjJzTndiV1dIbWg3NVQ0YVFGdGZYc1V4ZW05dTJwNjFIR3pmXCIpLFxuICAgIC8vIG5ldyBQdWJsaWNLZXkoXCJTU3dwa0VFY2JVcXg0dnRvRUJ5RmpTa2hLZENUODYyRE5WYjUyblpnMVVaXCIpXG4gIC8vICk7XG4gIC8vIGNvbnNvbGUubG9nKGF3YWl0IHNhYmVyUG9vbC5nZXRWaXJ0dWFsUHJpY2UoKSk7XG4vLyB9XG4vLyBtYWluKCkudGhlbihcbiAgLy8gKCkgPT4gcHJvY2Vzcy5leGl0KCksXG4gIC8vIGVyciA9PiB7XG4gICAgLy8gY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBjb21wbGV0ZSBhY3Rpb24uXCIpO1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAvLyBwcm9jZXNzLmV4aXQoLTEpO1xuICAvLyB9LFxuLy8gKTtcbi8vXG4iXX0=
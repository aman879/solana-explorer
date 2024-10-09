import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../App.css"


const BlockDetail = () => {
    const { slot } = useParams(); 
    const [block, setBlock] = useState(null);
    const [totalSuccess, setTotalSuccess] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlock = async () => {
            try {
                const response = await fetch(`https://solana-explorer-api-git-main-schizos-projects.vercel.app/block/${slot}`);
                if (response.status === 404) {
                    throw new Error("Block not found");
                }
                const data = await response.json();
                setBlock(data);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await fetch(`https://solana-explorer-api-git-main-schizos-projects.vercel.app/txs/${slot}`);
                if (!response.ok) {
                    throw new Error("Transactions not found");
                }
                const data = await response.json();
                console.log(data.length)
                const success = await fetch(`https://solana-explorer-api-git-main-schizos-projects.vercel.app/txSuccess/${slot}`)
                const res = await success.json();
                const successTx = await res.length;
                setTotalSuccess(successTx)
                // const transactionSignatures = data.transactions.slice(0, 50); for arangoDB3
                const transactionSignatures = data.slice(0, 50).map(transaction => 
                    transaction.signature
                );
                const txDetails = await Promise.all(
                    transactionSignatures.map(async (signature) => {
                        const txRes = await fetch(`https://solana-explorer-api-git-main-schizos-projects.vercel.app/tx/${signature}`);
                        return await txRes.json();
                    })
                );
                setTransactions(txDetails);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlock();
        fetchTransactions();
    }, [slot]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                alert("Transaction signature copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    const handleSignClick = (slot) => {
        if (slot) {
            navigate(`/tx/${slot}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <div>Loading block details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-white">
                <div>Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-7 pt-20 gradient-bg-welcome">
            {block ? (
                <div className="p-6 bg-transparent rounded-xl backdrop-filter backdrop-blur-lg">
                    <h2 className="text-2xl font-bold text-gray-100 mb-2">
                        Block
                    </h2>
                    <hr className="mb-4 border-purple-600"/>
                    <div className="border border-gray-700 rounded-xl p-5 bg-gray-700">
                        <h3 className="text-gray-100 font-bold mb-4">Overview</h3>
                        
                        <div className="flex justify-between text-gray-300 mb-4">
                            <span className="font-bold">Blockhash</span>
                            <span>{block.blockhash}</span>
                        </div>
                        <div className="flex justify-between text-gray-300 mb-4">
                            <span className="font-bold">Slot</span>
                            <span>{block.slot}</span>
                        </div>
                        
                        <div className="flex justify-between text-gray-300 mb-4">
                            <span className="font-bold">Block Height</span>
                            <span>{block.block_height}</span>
                        </div>

                        
                        <div className="flex justify-between text-gray-300 mb-4">
                            <span className="font-bold">Timestamp</span>
                            <span>{new Date(block.timestamp * 1000).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-gray-300 mb-4">
                            <span className="font-bold">Parent Blockhash</span>
                            <span>{block.parent_blockhash}</span>
                        </div>

                        <div className="flex justify-between text-gray-300 mb-4">
                            <span className="font-bold">Slot Leader</span>
                            <span>{block.slot_leader}</span>
                        </div>
                        
                        <div className="flex justify-between text-gray-300 mb-4">
                            <span className="font-bold">Processed Transactions</span>
                            <span>{block.transactions}</span>
                        </div>
                        
                        <div className="flex justify-between text-gray-300">
                            <span className="font-bold">Successful Transactions</span>
                            <span>{totalSuccess}</span>
                        </div>
                    </div>

                    <div className="border border-gray-700 rounded-xl p-5 bg-gray-700 mt-10"> 
                        <h3 className="text-gray-100 font-bold mb-4">Transactions</h3>
                        
                        {transactions.length > 0 ? (
                            <div className="mt-4">
                                <div className="flex justify-between text-gray-400 font-bold text-sm mb-2">
                                    <span className="w-1/5">Status</span>
                                    <span className="w-1/2">Signature</span>
                                    <span className="w-1/3">Fee</span>
                                    <span className="w-1/2">Log</span>
                                </div>

                                {transactions.map((tx, index) => {
                                    console.log(tx.metadata.status.Ok)
                                    const trimmedSignature = tx.signature.slice(0, 40) + "...";
                                    const cleanedLogs = tx.metadata.logMessages.map(log => log.replace(/(Program log:|Program)/g, '').trim());
                                    const isSuccess = tx.metadata.status.Ok !== undefined;

                                    return (
                                        <div
                                            key={tx.signature}
                                            className="flex flex-col justify-between border-b border-gray-600 text-sm h-auto pt-2"
                                        >
                                            <div className="flex justify-between place-items-center">
                                                <span className={`w-1/6 ${isSuccess? " text-green-500" : "text-red-500"}`}>
                                                    {isSuccess ? "Success" : "Failed"}
                                                </span>
                                                <span className="text-gray-100 overflow-hidden text-ellipsis w-1/2"
                                                >
                                                    <button 
                                                        onClick={() => copyToClipboard(tx.signature)} 
                                                        className="ml-2 text-blue-500 hover:underline"
                                                        title="Copy to clipboard"
                                                    >
                                                        📋
                                                    </button>
                                                    <span className="hover:underline hover:text-blue-200 hover:cursor-pointer" onClick={() => handleSignClick(tx.signature)}>
                                                        {trimmedSignature}
                                                    </span>    
                                                </span>
                                                <span className="text-gray-400 w-1/3">{tx.metadata.fee} lamports</span>
                                                <span className="text-gray-400 w-1/2 mb-2">
                                                    {cleanedLogs.map((log, logIndex) => (
                                                        
                                                        <div key={logIndex}>{log.slice(0, 50) + "..."}</div>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <p className="text-gray-200 text-xl">...</p>
                            </div>
                        ) : (
                            <p className="text-gray-400 mt-4">No transactions found</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Block not found</p>
            )}
        </div>
    );
};

export default BlockDetail;

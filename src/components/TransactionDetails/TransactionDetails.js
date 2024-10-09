import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TransactionDetail = () => {
    const { signature } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await fetch(`http://localhost:3000/tx/${signature}`);
                if (!response.ok) {
                    throw new Error("Transaction not found");
                }
                const data = await response.json();
                setTransaction(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [signature]);

    if (loading) {
        return <div>Loading transaction details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-7 pt-20 gradient-bg-welcome">
            {transaction ? (
                <div className="border border-gray-700 rounded-xl p-5 bg-gray-700">
                    <h3 className="text-gray-100 font-bold mb-4">Transaction Details</h3>
                    <div className="text-gray-400">
                        <pre className="whitespace-pre-wrap break-all overflow-x-auto">
                            {JSON.stringify(transaction, null, 2)}
                        </pre>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Transaction not found</p>
            )}
        </div>
    );
};

export default TransactionDetail;

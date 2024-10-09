import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Explorer = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate(); // to navigate to block details page

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const response = await fetch('http://localhost:3000/blocks/top');
                if (!response.ok) {
                    throw new Error("Failed to fetch blocks");
                }
                const data = await response.json();
                setBlocks(data); // Fetch and display only top 10 blocks
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlocks();
    }, []);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (search) {
            if (search.length > 40) {
                navigate(`/tx/${search}`);
            } else {
                navigate(`/block/${search}`);
            }
        }
    };

    const handleSlotClick = (slot) => {
        if (slot) {
            navigate(`/block/${slot}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container p-10 pt-20 text-white">
            <form onSubmit={handleSearchSubmit} className="flex justify-center item-center pt-20 mb-10">
                <input
                    type="text"
                    placeholder="Search by slot number or Tx signature"
                    className="px-4 py-2 w-1/2 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="ml-3 px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-700 transition">
                    Search
                </button>
            </form>

            <div className="p-6 bg-transparent border border-gray-600 shadow-lg rounded-xl backdrop-filter backdrop-blur-lg hover:border-blue-400 hover:shadow-xl transition duration-300">
                {blocks.length === 0 ? (
                    <p className="text-gray-400 text-center">No blocks found</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {blocks.slice(0, 5).map((block) => (
                            <div key={block.slot} className="border-b border-gray-500 pb-3">
                                <p className="text-lg font-semibold text-gray-100 hover:underline hover:text-blue-200 hover:cursor-pointer" onClick={() => handleSlotClick(block.slot)}>
                                    Slot {block.slot}
                                </p>
                                <div className="text-sm text-gray-400 mt-1">
                                    <p className="truncate">Blockhash: {block.blockhash}</p>
                                    <p>Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}</p>
                                    <div className="flex justify-between mt-2 text-gray-300">
                                        <span>Transactions: {block.transactions}</span>
                                        <span>Block Height: {block.block_height}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explorer;

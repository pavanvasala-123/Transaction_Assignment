import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from '../TransactionForm/TransactionForm';
import './TransactionTable.css';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      await axios.post('http://localhost:5000/api/transactions', transaction);
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div>
      <h2>Office Transactions</h2>
     
      {showForm && <TransactionForm onSubmit={addTransaction} onClose={() => setShowForm(false)} />}
      <div className={`table-container ${showForm ? 'blur' : ''}`}>
        <table>
          <thead>
          <tr>
              <th>Office Transactions</th>
              <th></th>
              <th></th>
              <th></th>
              <th> <button className="add-btn" onClick={() => setShowForm(true)}>+ Add Transaction</button></th>
            </tr>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.type === 'Credit' ? transaction.amount : ''}</td>
                <td>{transaction.type === 'Debit' ? transaction.amount : ''}</td>
                <td>{transaction.running_balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;

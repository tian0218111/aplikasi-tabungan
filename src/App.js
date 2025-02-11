import { useState, useEffect } from "react";

const initialUsers = [
  { name: "Ali", savings: 0, transactions: [] },
  { name: "Budi", savings: 0, transactions: [] },
  { name: "Citra", savings: 0, transactions: [] },
];

const containerStyle = {
  maxWidth: "800px",
  width: "90%",
  margin: "2rem auto",
  padding: "2rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  minHeight: "100vh",
};

const formControlStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "8px",
  border: "1px solid #ced4da",
  fontSize: "clamp(0.9rem, 2vw, 1rem)",
  margin: "0.5rem 0",
};

const buttonPrimaryStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "0.8rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "clamp(0.9rem, 2vw, 1rem)",
  margin: "0.5rem 0.5rem 0.5rem 0",
  width: "100%",
};

const userCardStyle = {
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "10px",
  margin: "1rem 0",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
};

export default function SavingsApp() {
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem("users");
      return savedUsers ? JSON.parse(savedUsers) : initialUsers;
    } catch (error) {
      return initialUsers;
    }
  });

  const [selectedUser, setSelectedUser] = useState(users[0]?.name || "");
  const [amount, setAmount] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleAddSavings = () => {
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("❗ Masukkan jumlah yang valid (lebih dari 0)");
      return;
    }
    
    const updatedUsers = users.map(user =>
      user.name === selectedUser ? {
        ...user,
        savings: user.savings + numericAmount,
        transactions: [...user.transactions, {
          type: "deposit",
          amount: numericAmount,
          date: new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }]
      } : user
    );
    
    setUsers(updatedUsers);
    setAmount("");
    setError("");
  };

  const handleResetSavings = () => {
    const updatedUsers = users.map(user => ({
      ...user,
      savings: 0,
      transactions: [...user.transactions, {
        type: "reset",
        date: new Date().toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }]
    }));
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (name) => {
    const updatedUsers = users.filter(user => user.name !== name);
    setUsers(updatedUsers);
    if (selectedUser === name) setSelectedUser(updatedUsers[0]?.name || "");
  };

  const handleAddUser = () => {
    if (!newUserName.trim() || users.some(user => user.name === newUserName.trim())) {
      setError("❌ Nama sudah digunakan atau tidak valid");
      return;
    }
    
    setUsers([...users, {
      name: newUserName.trim(),
      savings: 0,
      transactions: []
    }]);
    setNewUserName("");
    setError("");
  };

  const totalSavings = users.reduce((sum, user) => sum + user.savings, 0);

  return (
    <div style={containerStyle}>
      <h1 style={{ 
        color: "#2c3e50", 
        textAlign: "center", 
        marginBottom: "2rem",
        fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
      }}>
        🏦 Aplikasi Tabungan Kelompok
      </h1>

      {/* Form Input Section */}
      <div style={{ 
        backgroundColor: "white", 
        padding: "1.5rem", 
        borderRadius: "10px",
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
      }}>
        <select 
          style={formControlStyle}
          value={selectedUser} 
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {users.map(user => (
            <option key={user.name} value={user.name}>{user.name}</option>
          ))}
        </select>
        
        <div style={{ position: "relative" }}>
          <input
            style={formControlStyle}
            type="number"
            placeholder="💰 Jumlah tabungan"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div style={{ 
          display: "flex", 
          gap: "1rem",
          gridColumn: "1 / -1"
        }}>
          <button style={buttonPrimaryStyle} onClick={handleAddSavings}>
            💵 Tambah Tabungan
          </button>
          <button style={{ 
            ...buttonPrimaryStyle, 
            backgroundColor: "#dc3545" 
          }} onClick={handleResetSavings}>
            🔄 Reset Semua
          </button>
        </div>
      </div>

      {/* Add User Section */}
      <div style={{ 
        marginTop: "2rem",
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
      }}>
        <input
          style={formControlStyle}
          type="text"
          placeholder="Nama anggota baru"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button style={buttonPrimaryStyle} onClick={handleAddUser}>
          👤 Tambah Anggota
        </button>
      </div>

      {/* User Cards Section */}
      <div style={{ 
        marginTop: "2rem",
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
      }}>
        {users.map(user => (
          <div key={user.name} style={userCardStyle}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>👤 {user.name}</h3>
              <button 
                style={{ 
                  ...buttonPrimaryStyle, 
                  backgroundColor: "#dc3545",
                  padding: "0.4rem 0.8rem",
                  width: "auto"
                }}
                onClick={() => handleDeleteUser(user.name)}
              >
                Hapus
              </button>
            </div>
            
            <p style={{ 
              fontSize: "clamp(1rem, 2vw, 1.2rem)", 
              margin: "1rem 0",
              fontWeight: "bold", 
              color: "#2ecc71" 
            }}>
              Saldo: Rp{user.savings.toLocaleString()}
            </p>

            <div>
              <p style={{ fontWeight: "500", marginBottom: "0.5rem", fontSize: "0.9rem" }}>📜 Riwayat Transaksi:</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "150px", overflowY: "auto" }}>
                {user.transactions.map((transaction, index) => (
                  <li 
                    key={index}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                      borderRadius: "6px",
                      margin: "0.25rem 0",
                      fontSize: "0.85rem"
                    }}
                  >
                    {transaction.type === "deposit" ? (
                      `➕ Deposit: Rp${transaction.amount.toLocaleString()} (${transaction.date})`
                    ) : (
                      `🔄 Reset saldo (${transaction.date})`
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Total Savings */}
      <div style={{ 
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "1.5rem",
        borderRadius: "10px",
        marginTop: "2rem",
        textAlign: "center",
        position: "sticky",
        bottom: "1rem"
      }}>
        <h3 style={{ 
          margin: 0,
          fontSize: "clamp(1rem, 3vw, 1.2rem)"
        }}>
          Total Tabungan Kelompok: 
          <span style={{ 
            color: "#2ecc71", 
            marginLeft: "1rem",
            display: "inline-block"
          }}>
            Rp{totalSavings.toLocaleString()}
          </span>
        </h3>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

const initialUsers = [
  { name: "Ali", savings: 0, transactions: [] },
  { name: "Budi", savings: 0, transactions: [] },
  { name: "Citra", savings: 0, transactions: [] },
];

// Style constants untuk konsistensi
const containerStyle = {
  maxWidth: "600px",
  margin: "2rem auto",
  padding: "2rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
};

const formControlStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "8px",
  border: "1px solid #ced4da",
  fontSize: "1rem",
  margin: "0.5rem 0"
};

const buttonPrimaryStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "0.8rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  margin: "0.5rem 0.5rem 0.5rem 0"
};

const buttonDangerStyle = {
  ...buttonPrimaryStyle,
  backgroundColor: "#dc3545"
};

const userCardStyle = {
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "10px",
  margin: "1rem 0",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
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
          date: new Date().toLocaleString()
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
        date: new Date().toLocaleString()
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
      <h1 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "2rem" }}>
        🏦 Aplikasi Tabungan Kelompok
      </h1>

      {error && <div style={{ 
        backgroundColor: "#ffeef0", 
        padding: "1rem", 
        borderRadius: "8px", 
        color: "#dc3545",
        marginBottom: "1rem"
      }}>{error}</div>}

      <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "10px" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <select 
            style={formControlStyle}
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map(user => (
              <option key={user.name} value={user.name}>{user.name}</option>
            ))}
          </select>
          
          <input
            style={formControlStyle}
            type="number"
            placeholder="💰 Jumlah tabungan"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={buttonPrimaryStyle} onClick={handleAddSavings}>
            💵 Tambah Tabungan
          </button>
          <button style={buttonDangerStyle} onClick={handleResetSavings}>
            🔄 Reset Semua
          </button>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>➕ Tambah Anggota Baru</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
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
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>📊 Rekapitulasi Tabungan</h2>
        
        {users.map(user => (
          <div key={user.name} style={userCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>👤 {user.name}</h3>
              <button 
                style={{ ...buttonDangerStyle, padding: "0.4rem 0.8rem" }}
                onClick={() => handleDeleteUser(user.name)}
              >
                Hapus
              </button>
            </div>
            
            <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
              Saldo: <span style={{ fontWeight: "bold", color: "#2ecc71" }}>
                Rp{user.savings.toLocaleString()}
              </span>
            </p>

            <div>
              <p style={{ fontWeight: "500", marginBottom: "0.5rem" }}>📜 Riwayat Transaksi:</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {user.transactions.map((transaction, index) => (
                  <li 
                    key={index}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                      borderRadius: "6px",
                      margin: "0.25rem 0"
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

        <div style={{ 
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          marginTop: "2rem",
          textAlign: "center"
        }}>
          <h3 style={{ margin: 0 }}>
            Total Tabungan Kelompok: 
            <span style={{ color: "#2ecc71", marginLeft: "1rem" }}>
              Rp{totalSavings.toLocaleString()}
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
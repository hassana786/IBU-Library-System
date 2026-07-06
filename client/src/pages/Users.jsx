import React, { useState, useEffect } from 'react';
import userService from '../services/userService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: 'changeme123', roleId: 3 });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data.data.users);
    } catch (error) {
      console.error("Cilad soo akhrinta users-ka", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      loadUsers(); // Dib u soo cusboonaysii liiska
    } catch (error) {
      alert("Cilad baa ka dhacday diiwaangelinta.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar - Naqshadda saxda ah */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>IBU Library 📚</h2>
        <div style={styles.userInfo}>
          <p style={styles.userName}>Hassan Ahmed</p>
          <span style={styles.userRole}>System Administrator</span>
        </div>
        <ul style={styles.menuList}>
          <li style={styles.menuItem} onClick={() => window.location.href='/dashboard'}>📊 Dashboard</li>
          <li style={styles.menuItem} onClick={() => window.location.href='/books'}>📚 Maamulka Buugaagta</li>
          <li style={styles.activeMenu}>👥 Ardayda & Macalimiinta</li>
          <li style={styles.menuItem} onClick={() => window.location.href='/borrow'}>🔄 Amaahinta Buugaagta</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2>Maamulka Ardayda & Macalimiinta</h2>
        <p style={{marginBottom: '20px'}}>Halkan ku diiwaangeli xubnaha cusub ee maktabadda, kuna maamul kuwa jira.</p>

        {/* Foomka Diiwaangelinta */}
        <div style={styles.card}>
          <h4 style={{marginBottom: '15px'}}>+ Diiwaangeli Xubin Cusub</h4>
          <form onSubmit={handleSubmit} style={styles.formLayout}>
            <div style={styles.inputGroup}>
              <input style={styles.input} placeholder="Magaca hore" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              <input style={styles.input} placeholder="Magaca dambe" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <input style={{...styles.input, width: '100%', marginBottom: '10px'}} placeholder="Email-ka rasmiga ah" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <div style={styles.inputGroup}>
              <select style={styles.input} value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: parseInt(e.target.value)})}>
                <option value="3">Arday (Student)</option>
                <option value="2">Macallin (Librarian)</option>
              </select>
              <button style={styles.button} type="submit">Diiwaangeli Xubinta</button>
            </div>
          </form>
        </div>

        {/* Liiska Xubnaha */}
        <div style={styles.card}>
          <h4>📋 Liiska Xubnaha Iska Diwaangeliyey ({users.length})</h4>
          <table style={styles.table}>
            <thead>
              <tr style={styles.th}>
                <th style={styles.td}>ID</th><th style={styles.td}>Magaca</th><th style={styles.td}>Email</th><th style={styles.td}>Doorka (Role)</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.firstName} {u.lastName}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.role?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Arial, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#1e293b', color: '#fff', padding: '20px' },
  logo: { fontSize: '22px', textAlign: 'center', marginBottom: '20px', color: '#38bdf8' },
  userInfo: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #334155', paddingBottom: '15px' },
  userName: { margin: 0, fontWeight: 'bold' },
  userRole: { fontSize: '12px', color: '#94a3b8' },
  menuList: { listStyle: 'none', padding: 0 },
  menuItem: { padding: '12px', cursor: 'pointer', color: '#cbd5e1' },
  activeMenu: { padding: '12px', backgroundColor: '#0284c7', color: '#fff', borderRadius: '6px', fontWeight: 'bold' },
  mainContent: { flexGrow: 1, padding: '30px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' },
  formLayout: { display: 'flex', flexDirection: 'column' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '10px' },
  input: { flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '5px' },
  button: { backgroundColor: '#0284c7', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  th: { backgroundColor: '#f8fafc', padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' },
  td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
  tr: { ':hover': { backgroundColor: '#f1f5f9' } }
};

export default Users;
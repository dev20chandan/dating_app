async function run() {
  let token;
  try {
    await fetch('http://localhost:4030/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test4@admin.com', password: 'password' })
    });
  } catch (e) {}
  
  try {
    const res = await fetch('http://localhost:4030/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test4@admin.com', password: 'password' })
    });
    const data = await res.json();
    token = data.access_token;
    console.log("Token:", token);
    
    const res2 = await fetch('http://localhost:4030/admin/users', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    console.log("Status:", res2.status);
    const data2 = await res2.json();
    console.log("Data:", data2);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();

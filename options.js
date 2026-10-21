const api = globalThis.browser ?? globalThis.chrome;
const $ = (id) => document.getElementById(id);
api.storage.local.get({ port: 6800, token: "", intercept: true, minSizeKB: 0 }).then((c) => {
  $("token").value = c.token; $("port").value = c.port; $("min").value = c.minSizeKB; $("intercept").checked = c.intercept;
});
$("save").onclick = async () => {
  const c = { token: $("token").value.trim(), port: +$("port").value || 6800, minSizeKB: +$("min").value || 0, intercept: $("intercept").checked };
  await api.storage.local.set(c);
  try {
    const r = await fetch(`http://127.0.0.1:${c.port}/ping`, { headers: { "X-OpenDM-Token": c.token } });
    $("msg").textContent = r.ok ? "Connected to OpenDM ✔" : r.status === 401 ? "Wrong token" : "Error " + r.status;
  } catch { $("msg").textContent = "OpenDM isn't running (or port is wrong)"; }
};

// ===== State + storage =====
const KEY = 'crud-student-table-v1';
const uid = () => Math.random().toString(36).slice(2, 8);
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } };
const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

let items = load();
let editingId = null;



// ===== DOM =====
const $name = document.getElementById('name');
const $save = document.getElementById('save');
const $cancel = document.getElementById('cancel');
const $mode = document.getElementById('mode');
const $tbody = document.getElementById('tbody');
const $count = document.getElementById('count');

function setCreate() {
    editingId = null; $name.value = ''; $name.focus();
    $mode.textContent = 'Thêm item';
    $cancel.style.display = 'none';
}
function setEdit(it) {
    editingId = it.id; $name.value = it.name; $name.focus();
    $mode.textContent = `Sửa item (#${it.id})`;
    $cancel.style.display = '';
}

function render() {
    $count.textContent = items.length + ' items';
    if (items.length === 0) {
        $tbody.innerHTML = '<tr><td colspan="3" class="empty">Chưa có dữ liệu</td></tr>';
        return;
    }
    $tbody.innerHTML = items.map(it => `
<tr>
    <td class="id">#${it.id}</td>
    <td>${escapeHtml(it.name)}</td>
    <td>
    <div class="toolbar">
        <button onclick="editItem('${it.id}')">Sửa</button>
        <button onclick="delItem('${it.id}')">Xoá</button>
    </div>
    </td>
</tr>
`).join('');
}

function addOrUpdate() {
    const name = ($name.value || '').trim();
    if (!name) { $name.focus(); return; }
    if (editingId) {
        items = items.map(x => x.id === editingId ? { ...x, name } : x);
    } else {
        items.push({ id: uid(), name });
    }
    save(items); render(); setCreate();
}

function editItem(id) {
    const it = items.find(x => x.id === id); if (!it) return; setEdit(it);
}
function delItem(id) {
    items = items.filter(x => x.id !== id); save(items); render();
    if (editingId === id) setCreate();
}
function escapeHtml(s) {
    return s.replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));
}

// ===== Events =====
$save.addEventListener('click', addOrUpdate);
$cancel.addEventListener('click', setCreate);
$name.addEventListener('keydown', e => { if (e.key === 'Enter') addOrUpdate(); });
document.getElementById('reset').addEventListener('click', () => {
    if (confirm('Xoá toàn bộ dữ liệu?')) { items = []; save(items); render(); setCreate(); }
});

// expose inline
window.editItem = editItem; window.delItem = delItem;

// boot
render(); setCreate();
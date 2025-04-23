document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Vui lòng đăng nhập lại!');
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5276/api/SinhVien', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
            localStorage.removeItem('token');
            window.location.href = '/index.html';
            return;
        }

        if (!response.ok) {
            const errorMessage = await response.text();
            alert(`Lỗi lấy thông tin sinh viên: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const student = data.$values ? data.$values[0] : data;
        if (!student) throw new Error('Không có dữ liệu sinh viên');

        document.getElementById('text_name').textContent = student.tenSinhVien;
        document.getElementById('student_name').textContent = student.tenSinhVien;
        document.getElementById('student_id').textContent = student.maSinhVien;
        document.getElementById('student_class').textContent = student.lop;
        document.getElementById('student_phone').textContent = student.soDienThoai;
        document.getElementById('Academic_advisor').textContent = student.coVanHocTap;
        document.getElementById('Health_insurance').textContent = student.baoHiem ? '✅ ' : '❌';
        document.getElementById('student_fee').innerHTML += student.hocPhi;
        document.getElementById('student_gender').textContent = student.gioiTinh ? 'Nam' : 'Nữ';
        document.getElementById('student_gpa').textContent = `GPA: ${student.trungBinhTrungTichLuy}/4`;
        document.getElementById('student_presence').textContent = student.tinhTrangHocTap;
        document.getElementById('student_failed_credits').textContent = student.soLuongDiemF;
        document.getElementById('student_rank').textContent = student.xepLoai;

    } catch (error) {
        console.error('Lỗi:', error.message);
    }

});

//đăng xuất
document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
});
// //dropdown
// document.querySelector('.user-avatar button').addEventListener('click', function (e) {
//     e.preventDefault(); // Ngăn chặn hành vi mặc định của button
//     let dropdown = document.getElementById('dropdown');
//     dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
// });

// // Đóng dropdown khi click bên ngoài
// document.addEventListener('click', function (e) {
//     let dropdown = document.getElementById('dropdown');
//     let userAvatar = document.querySelector('.user-avatar button');
//     if (!userAvatar.contains(e.target) && !dropdown.contains(e.target)) {
//         dropdown.style.display = 'none';
//     }
// });

//action đổi mật khẩu
// document.getElementById('change_password').addEventListener('click', function () {
//     document.getElementById('overlay').style.display = 'block';
//     document.getElementById('passwordModal').style.display = 'block';
// });

// document.getElementById('close').addEventListener('click', function () {
//     document.getElementById('overlay').style.display = 'none';
//     document.getElementById('passwordModal').style.display = 'none';
// });

// document.getElementById('overlay').addEventListener('click', function () {
//     document.getElementById('overlay').style.display = 'none';
//     document.getElementById('passwordModal').style.display = 'none';
// });

//api đổi mật khẩu
async function changePassword() {
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Vui lòng đăng nhập lại!', 'error');
        return;
    }

    const oldPassword = document.getElementById('oldPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const messageEl = document.getElementById('message');
    const loaderEl = document.getElementById('loader');
    const changeBtn = document.getElementById('changeBtn');

    if (!oldPassword || !newPassword || !confirmPassword) {
        showMessage('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    if (newPassword !== confirmPassword) {
        showMessage('Mật khẩu mới và xác nhận mật khẩu không khớp', 'error');
        return;
    }
    if (newPassword.length < 6) {
        showMessage('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
        return;
    }

    // hiển thị loading
    loaderEl.style.display = 'block';
    changeBtn.disabled = true;
    messageEl.style.display = 'none';

    try {
        const response = await fetch('http://localhost:5276/api/Login/ChangePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Lỗi không xác định');
        }

        showMessage('Đổi mật khẩu thành công!', 'success');

        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    } catch (error) {
        console.error('Lỗi:', error);
        showMessage(error.message || 'Không thể đổi mật khẩu. Vui lòng thử lại sau.', 'error');
    } finally {
        loaderEl.style.display = 'none';
        changeBtn.disabled = false;
    }
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + type;
    messageEl.style.display = 'block';
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

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

        if (!response.ok) {
            throw new Error('Không thể lấy thông tin sinh viên');
        }

        const data = await response.json();
        const student = data.$values[0];
        document.getElementById('text_name').textContent = student.tenSinhVien;
        document.getElementById('student_name').textContent = student.tenSinhVien;
        document.getElementById('student_id').textContent = student.maSinhVien;
        document.getElementById('student_class').textContent = student.lop;
        document.getElementById('student_phone').textContent = student.soDienThoai;
        document.getElementById('student_birthday').textContent = student.ngaySinh; 
        document.getElementById('Health_insurance').textContent = student.baoHiem; 
        document.getElementById('student_fee').textContent = student.hocPhi; 
        document.getElementById('nation').textContent = student.danToc;
        document.getElementById('student_gpa').textContent = student.trungBinhTrungTichLuy; 
        document.getElementById('student_cmnd').textContent = student.cccd;
        document.getElementById('student_failed_credits').textContent = student.soLuongDiemF; 
        document.getElementById('student_gender').textContent = student.gioiTinh ? "Nam" : "Nữ";
        document.getElementById('student_presence').textContent = student.tinhTrangHocTap; 
    } catch (error) {
        console.error('Lỗi:', error.message);
    }
});

document.getElementById('text_name').addEventListener('click', mode)

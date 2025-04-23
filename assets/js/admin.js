document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Vui lòng đăng nhập lại!');
        window.location.href = '/index.html';
        return;
    }

    const form = document.getElementById('importForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('excelFile');
        const file = fileInput.files[0];

        if (!file) {
            alert("Vui lòng chọn file Excel!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5276/api/Admin/import-excel", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.status === 401) {
                alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
                localStorage.removeItem('token');
                window.location.href = '/index.html';
                return;
            }

            const result = await response.json();
            if (response.ok) {
                document.getElementById("message").innerText = "Import thành công!";
            } else {
                document.getElementById("message").innerText = "Lỗi: " + (result.message || "Không thể import file.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            document.getElementById("message").innerText = "Có lỗi xảy ra khi gửi yêu cầu.";
        }
    });
});
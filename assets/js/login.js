const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
//đăng nhập
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-login');
    const loginBtn = document.getElementById('login-btn');
    const loadingIndicator = document.getElementById('loading');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const rememberMe = document.getElementById('rememberMe');

    if (localStorage.getItem('rememberedUser')) {
        try {
            const savedUser = JSON.parse(localStorage.getItem('rememberedUser'));
            document.getElementById('username').value = savedUser.email || '';
            if (savedUser.rememberMe) {
                rememberMe.checked = true;
            }
        } catch (e) {
            console.error('Lỗi khi đọc thông tin đã lưu:', e);
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        login();
    });

    function validateForm() {
        let isValid = true;
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        emailError.textContent = '';
        passwordError.textContent = '';

        if (!email) {
            emailError.textContent = 'Vui lòng nhập email';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            emailError.textContent = 'Email không hợp lệ';
            isValid = false;
        }

        if (!password) {
            passwordError.textContent = 'Vui lòng nhập mật khẩu';
            isValid = false;
        }

        return isValid;
    }

    function login() {
        if (!validateForm()) {
            return;
        }

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        loadingIndicator.style.display = 'block';
        loginBtn.disabled = true;

        const loginData = {
            email: email,
            password: password
        };

        fetch('http://localhost:5276/api/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Đăng nhập thất bại');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('token', data.token);

                if (rememberMe.checked) { //nhớ mk
                    localStorage.setItem('rememberedUser', JSON.stringify({
                        email: email,
                        rememberMe: true
                    }));
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                const vaiTroId = parseJwt(data.token).VaiTroId;

                if (vaiTroId === "1") {
                    window.location.href = 'admin.html';
                } else if (vaiTroId === "2") {
                    window.location.href = 'welcome.html';
                } else {
                    passwordError.textContent = 'Vai trò không được hỗ trợ';
                }
            })
            .catch(error => {
                console.error('Lỗi:', error);
                passwordError.textContent = 'Thông tin đăng nhập không chính xác';
            })
            .finally(() => {
                loadingIndicator.style.display = 'none';
                loginBtn.disabled = false;
            });
    }

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Lỗi phân tích JWT:', e);
            return {};
        }
    }
});

//quên mật khẩu
document.getElementById('form-1').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    if (!email) {
        alert('Vui lòng nhập email!');
        return;
    }


    const formData = new FormData();
    formData.append('email', email);

    try {
        const response = await fetch('http://localhost:5276/api/SendMail/send-password', {
            method: 'POST',
            body: JSON.stringify({ email: email }),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (response.ok) {
            alert('Vui lòng kiểm tra email của bạn để nhận mật khẩu mới!');
        } else {
            alert(result.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Không thể kết nối đến server.');
    }
});

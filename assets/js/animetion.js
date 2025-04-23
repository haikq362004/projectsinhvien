let scene, camera, renderer;
let particles = [];

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create particles
    const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.7
    });

    for (let i = 0; i < 200; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.position.x = Math.random() * 40 - 20;
        particle.position.y = Math.random() * 40 - 20;
        particle.position.z = Math.random() * 40 - 20;
        particle.material.color.setHSL(Math.random(), 0.7, 0.5);
        particle.userData = {
            velocity: new THREE.Vector3(
                Math.random() * 0.01 - 0.005,
                Math.random() * 0.01 - 0.005,
                Math.random() * 0.01 - 0.005
            ),
            rotationSpeed: Math.random() * 0.02 - 0.01
        };
        particles.push(particle);
        scene.add(particle);
    }

    camera.position.z = 15;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    particles.forEach(particle => {
        particle.position.add(particle.userData.velocity);
        particle.rotation.x += particle.userData.rotationSpeed;
        particle.rotation.y += particle.userData.rotationSpeed;

        // Boundaries check
        if (Math.abs(particle.position.x) > 20) particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 20) particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 20) particle.userData.velocity.z *= -1;
    });

    // Rotate camera around the scene
    camera.position.x = 15 * Math.sin(Date.now() * 0.0001);
    camera.position.z = 15 * Math.cos(Date.now() * 0.0001);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function initGSAP() {
    gsap.from('.header', {
        y: -100,
        opacity: 0,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)'
    });

    gsap.from('.section-title', {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'back.out(1.7)'
    });

    gsap.from('.info-card', {
        rotationY: 90,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.from('.study-status', {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
    });

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('glowing-particles');
        document.body.appendChild(particle);

        gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        });

        gsap.to(particle, {
            x: '+=' + (Math.random() * 200 - 100),
            y: '+=' + (Math.random() * 200 - 100),
            opacity: Math.random() * 0.7 + 0.3,
            scale: Math.random() * 2 + 1,
            duration: Math.random() * 10 + 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

function initModal() {
    const passwordModal = document.getElementById('password-modal');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const passwordForm = document.getElementById('password-form');

    // Open modal
    changePasswordBtn.addEventListener('click', () => {
        passwordModal.classList.add('active');

        gsap.from('.modal-container', {
            y: -50,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });
    });

    closeModalBtn.addEventListener('click', () => {
        gsap.to('.modal-container', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                passwordModal.classList.remove('active');
                // Reset form
                passwordForm.reset();
            }
        });
    });

    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            gsap.to('.modal-container', {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    passwordModal.classList.remove('active');
                    // Reset form
                    passwordForm.reset();
                }
            });
        }
    });

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Add validation logic here
        if (newPassword !== confirmPassword) {
            alert("Mật khẩu mới không khớp với xác nhận mật khẩu!");
            return;
        }

        gsap.to('.form-button', {
            backgroundColor: '#00ff00',
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                setTimeout(() => {
                    // Show success message
                    alert("Mật khẩu đã được thay đổi thành công!");

                    // Close modal
                    gsap.to('.modal-container', {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            passwordModal.classList.remove('active');
                            // Reset form
                            passwordForm.reset();
                        }
                    });
                }, 500);
            }
        });
    });

    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
                duration: 0.3
            });
        });

        input.addEventListener('blur', () => {
            gsap.to(input, {
                boxShadow: '0 0 0px rgba(255, 0, 255, 0)',
                duration: 0.3
            });
        });
    });
}

window.onload = function () {
    initThree();
    initGSAP();
    initModal();
};
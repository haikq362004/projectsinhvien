async function fetchStudentData() {
    try {
        const response = await fetch("API_ENDPOINT_HERE");
        const data = await response.json();

        document.getElementById("student_name").textContent = data.name;
        document.getElementById("student_id").textContent = data.studentId;
        document.getElementById("student_presence").textContent = data.status;
        document.getElementById("student_class").textContent = data.class;
        document.getElementById("student_faculty").textContent = data.faculty;
        document.getElementById("student_fee").textContent = data.fee;
        document.getElementById("student_total_credits").textContent = data.totalCredits;
        document.getElementById("student_gpa").textContent = data.gpa;
        document.getElementById("student_rank").textContent = data.rank;
        document.getElementById("student_failed_credits").textContent = data.failedCredits;

      
        const semesterTable = document.getElementById("student_current_semester");
        semesterTable.innerHTML = ""; // Xóa nội dung cũ

        data.currentSemester.forEach((subject, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${subject.name}</td>
                <td>${subject.code}</td>
                <td style="color:red;">${subject.credits}</td>
                <td style="color:red;">${subject.attendance}</td>
                <td style="color:red;">${subject.exam}</td>
                <td style="color:red;">${subject.finalScore}</td>
                <td style="color:red;">${subject.courseScore}</td>
                <td style="color:red;">${subject.gpaScale4}</td>
            `;
            semesterTable.appendChild(row);
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sinh viên:", error);
    }
}
fetchStudentData();

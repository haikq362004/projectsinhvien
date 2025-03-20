document.addEventListener('DOMContentLoaded', function () {
    const calendarBody = document.getElementById('calendar-body');
    const selectedDayInfo = document.getElementById('selected-day');


    function renderCalendar() {
        const daysInMonth = 31;
        const firstDay = new Date(2024, 9, 7).getDay();

        let row = document.createElement('tr');

        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement('td'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let cell = document.createElement('td');
            cell.textContent = day;
            cell.classList.add('day-cell');

            cell.addEventListener('click', function () {
                displayDayInfo(day);
            });

            row.appendChild(cell);

        
            if ((day + firstDay) % 7 === 0) {
                calendarBody.appendChild(row);
                row = document.createElement('tr');
            }
        }

        if (row.children.length > 0) {
            calendarBody.appendChild(row);
        }
    }

  
    function displayDayInfo(day) {
        const dayInfo = `You selected: October ${day}, 2024.`;
        selectedDayInfo.textContent = dayInfo;
    }

    renderCalendar();
});
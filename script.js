document.addEventListener('DOMContentLoaded', () => {
    const talkList = document.getElementById('talk-list');
    const categoryFilter = document.getElementById('category-filter');

    // Helper to format time
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Function to generate and display the schedule
    const renderSchedule = (talksToRender) => {
        talkList.innerHTML = ''; // Clear previous schedule

        let currentTime = new Date();
        currentTime.setHours(10, 0, 0); // Event starts at 10:00 AM

        const allCategories = new Set(); // To collect all unique categories

        // Add "All Categories" option if it's the initial render
        if (categoryFilter.options.length <= 1) {
            talksData.forEach(talk => talk.category.forEach(cat => allCategories.add(cat)));
            allCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categoryFilter.appendChild(option);
            });
        }

        talksToRender.forEach((talk, index) => {
            // Add lunch break after the 3rd talk
            if (index === Math.floor(talksData.length / 2) && talksToRender === talksData) { // Only add if rendering full schedule
                const lunchStartTime = formatTime(currentTime);
                currentTime.setHours(currentTime.getHours() + 1); // 1 hour lunch
                const lunchEndTime = formatTime(currentTime);

                const breakCard = document.createElement('div');
                breakCard.classList.add('break-card');
                breakCard.innerHTML = `<p class="time">${lunchStartTime} - ${lunchEndTime}</p><p>Lunch Break</p>`;
                talkList.appendChild(breakCard);
            }

            const talkStartTime = formatTime(currentTime);
            currentTime.setMinutes(currentTime.getMinutes() + talk.duration); // Add talk duration
            const talkEndTime = formatTime(currentTime);

            const talkCard = document.createElement('div');
            talkCard.classList.add('talk-card');
            talkCard.innerHTML = `
                <p class="time">${talkStartTime} - ${talkEndTime}</p>
                <h3>${talk.title}</h3>
                <p class="speakers">Speakers: ${talk.speakers.join(', ')}</p>
                <p class="category">Category: ${talk.category.join(', ')}</p>
                <p class="description">${talk.description}</p>
            `;
            talkList.appendChild(talkCard);

            // Add transition time if it's not the last talk
            if (index < talksToRender.length - 1) {
                currentTime.setMinutes(currentTime.getMinutes() + 10); // 10 minutes transition
            }
        });
    };

    // Event listener for category filter
    categoryFilter.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory === 'all') {
            renderSchedule(talksData);
        } else {
            const filteredTalks = talksData.filter(talk =>
                talk.category.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
            );
            renderSchedule(filteredTalks);
        }
    });

    // Initial render of the full schedule and populate filter options
    renderSchedule(talksData);
});

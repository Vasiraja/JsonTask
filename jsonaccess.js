document.addEventListener('DOMContentLoaded', () => {
    const employeeDetails = document.getElementById('employeeDetails');
    const paginationContainer = document.getElementById('pagination');
    let data = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    fetch('assets/jsonfile.json')
        .then(res => res.json())
        .then(jsonData => {
            data = jsonData;
            renderTable();
            renderPagination();

            // Add event listeners for table header clicks
            const tableHeaders = document.querySelectorAll('#employeeDetails th');
            tableHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const column = header.getAttribute('data-column');
                    sortTable(column);
                    updateURLParams(column);
                });
            });

            // Check for initial sorting in URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const sortColumn = urlParams.get('sort');
            if (sortColumn) {
                sortTable(sortColumn);
            }
        })
        .catch(error => console.error('Error fetching JSON: ', error));

    function renderTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = data.slice(startIndex, endIndex);

        employeeDetails.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th data-column="id">S.No</th>
                        <th data-column="first_name" style="cursor:pointer">FirstName</th>
                        <th data-column="gender" style="cursor:pointer">Gender</th>
                        <th data-column="email" style="cursor:pointer">Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentData.map(details => `
                        <tr>
                            <td>${details.id}</td>
                            <td>${details.first_name}</td>
                            <td>${details.gender}</td>
                            <td>${details.email}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function renderPagination() {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('li');
            const pageLink = document.createElement('a');
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                renderTable();
            });
            pageButton.appendChild(pageLink);
            paginationContainer.appendChild(pageButton);
        }
    }

    function sortTable(column) {
        data.sort((a, b) => {
            const valueA = a[column];
            const valueB = b[column];

            if (typeof valueA === 'string') {
                return valueA.localeCompare(valueB);
            } else {
                return valueA - valueB;
            }
        });

        renderTable();
    }

    function updateURLParams(column) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('sort', column);
        const newURL = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, '', newURL);
    }
});




<!doctype html>
<html lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Student Management</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
    <form method="post" action="connection.php" target="_blank">
<main class="container">
<h1>Student Managment Dashboard</h1>
<section class="card form-card">
<h2>Add/Edit Student</h2>
<form id="studentForm" method="POST"> 
<input type="hidden" id="studentId">
<div class="row">
<label>Name</label>
<input id="name" required>
</div>
<div class="row">
<label>ID</label>
<input id="roll" required>
</div>
<div class="row">
<label>Department</label>
<input id="dept">
</div>
<div class="row">
<label>GPA</label>
<input id="gpa" type="number" step="0.01" min="0" max="4">
</div>
<div class="actions">
<button type="submit" id="saveBtn">Save</button>
<button type="button" id="clearBtn">Clear</button>
</div>
</form>
</section>


<section class="card list-card">
<div class="list-header">
<input id="search" placeholder="  Search By Name or ID  ">
<select id="sortSelect">
<option value="">-- Sort By --</option>
<option value="name">Name</option>
<option value="roll">ID</option>
<option value="gpa">GPA</option>
</select>
<button id="exportBtn">Export CSV</button>
<label><input type="checkbox" id="useBackendToggle">PHP</label>
</div>
<table id="studentsTable">
<thead>
<tr>
<th>#</th>
<th>Name</th>
<th>ID</th>
<th>Department</th>
<th>GPA</th>
<th>procedures</th>
</tr>
</thead>
<tbody></tbody>
</table>
</section>
</main>
</form>
<script src="script.js"></script>
</body>
</html>
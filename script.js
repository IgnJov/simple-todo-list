let globalTaskList = [];
let globalSelectedStatus = "pending";

let showUserDetailDialog = () => {
	let username = prompt("Type your name...", 'Guest');
	let userPosition = prompt("Type your position...", 'Employee');

	document.getElementById("username").innerHTML = username;
	document.getElementById("user-position").innerHTML = userPosition;
};

let generateTaskObj = (detail, priority, deadline) => {
	return {
		id:
			globalTaskList.length == 0
				? 1
				: globalTaskList[globalTaskList.length - 1].id + 1,
		detail: detail,
		priority: priority,
		deadline: deadline,
		status: "pending",
	};
};

let setOverdueTask = () => {
	globalTaskList.forEach((task) => {
		if (new Date(task.deadline).getDate() < new Date().getDate())
			task.status = "overdue";
	});
};

let addTask = () => {
	if (validateTaskInput()) {
		let taskDetail = document.querySelector("#task-detail").value;
		let taskPriority = document.querySelector("#priority-select").value;
		let taskDeadline = document.querySelector("#deadline-input").value;

		let newTask = generateTaskObj(taskDetail, taskPriority, taskDeadline);
		globalTaskList.push(newTask);

		document.getElementById("pending").click();
	}
};

let clearTask = () => {
	globalTaskList = globalTaskList.filter(
		(task) => task.status != globalSelectedStatus
	);
	updateTaskList();
};

let capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

let updateTaskList = () => {
	let taskList = document.querySelector(".task-list");

	if (taskList) {
		taskList.innerHTML = "";

		// Sort based on priority
		globalTaskList.sort((a, b) => {
			if (a.priority == "high" && b.priority != "high") {
				return -1;
			} else if (a.priority == "medium" && b.priority == "high") {
				return 1;
			} else if (a.priority == "medium" && b.priority == "low") {
				return -1;
			} else if (a.priority == "low" && b.priority != "low") {
				return 1;
			} else {
				return 0;
			}
		});

		globalTaskList
			.filter((task) => task.status == globalSelectedStatus)
			.forEach((task) => {
				let checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.addEventListener("click", () => {
					onTaskChecked(task.id);
				});
				if (task.status == "done") checkbox.checked = true;
				let taskName = document.createElement("p");
				taskName.className = "task-name";
				taskName.innerHTML = task.detail || "";

				let taskPriorityDeadline = document.createElement("span");
				taskPriorityDeadline.className = "task-priority-deadline";
				taskPriorityDeadline.innerHTML =
					task.priority && task.deadline
						? `${capitalizeFirstLetter(task.priority)} | ${task.deadline}`
						: "";

				let taskDetailDiv = document.createElement("div");
				taskDetailDiv.className = "task-detail";
				if (task.status == "done")
					taskDetailDiv.style.textDecoration = "line-through";
				taskDetailDiv.appendChild(taskName);
				taskDetailDiv.appendChild(taskPriorityDeadline);

				let taskDiv = document.createElement("div");
				taskDiv.className = "task";
				taskDiv.appendChild(checkbox);
				taskDiv.appendChild(taskDetailDiv);

				taskList.appendChild(taskDiv);
			});
	}
};

let validateTaskInput = () => {
	let taskDetail = document.querySelector("#task-detail").value;
	let taskPriority = document.querySelector("#priority-select").value;
	let taskDeadline = document.querySelector("#deadline-input").value;

	if (taskDetail.trim().length == 0 || taskDetail == null) {
		alert("Please input task detail!");
		return false;
	} else if (taskPriority == null) {
		alert("Please select task priority!");
		return false;
	} else if (taskDeadline == null) {
		alert("Please input task deadline date!");
		return false;
	} else if (
		taskDeadline != null &&
		new Date(taskDeadline).getDate() < new Date().getDate()
	) {
		alert("Task deadline date can't be in the past!");
		return false;
	}

	return true;
};

let onTaskChecked = (taskId) => {
	let selectedTask = globalTaskList.find((task) => task.id == taskId);

	if (selectedTask) {
		selectedTask.status = "done";
	}

	updateTaskList();
};

let getCurrentDateString = () => {
	// Get the current date
	const today = new Date();

	// Format the date to YYYY-MM-DD
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, "0");
	const dd = String(today.getDate()).padStart(2, "0");

	const formattedDate = `${yyyy}-${mm}-${dd}`;

	return formattedDate;
};

let setCurrentDate = () => {
	// Set Deadline Input
	document.querySelector("#deadline-input").value = getCurrentDateString();

	// Set Date Indicator
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const currentWeekDay = days[new Date().getDay()];
	const currentMonthName = months[new Date().getMonth()];
	const currentDay = new Date().getDate();
	const currentYear = new Date().getFullYear();

	document.querySelector(".date-container #weekday").innerHTML = currentWeekDay;
	document.querySelector(
		".date-container #date"
	).innerHTML = `${currentDay} ${currentMonthName} ${currentYear}`;
};

let onTaskListStatusChange = (e) => {
	globalSelectedStatus = e.target.id;

	let previousSelectedStatusButton = document.querySelector(
		".task-status-button-container .selected-task"
	);
	previousSelectedStatusButton.classList.remove("selected-task");
	e.target.classList.add("selected-task");

	updateTaskList();
};

window.onload = () => {
	setCurrentDate();
	showUserDetailDialog();
};

document.getElementById("add-task-button").addEventListener("click", addTask);
document
	.getElementById("clear-task-button")
	.addEventListener("click", clearTask);

document.querySelectorAll(".task-status-button").forEach((button) => {
	button.addEventListener("click", onTaskListStatusChange);
});
